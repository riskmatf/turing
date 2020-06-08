<template>
    <el-popover v-model="isOpen" trigger="click" content="test" :popper-class="classesForPopper" :visible-arrow="false">
        <div slot="reference" class="el-input__inner selected-element" :class="selectedItemsClass">
            <slot name="selectedItem">
                <template v-if="multiSelect">
                    <span v-if="selectedItem.length === 0">{{ placeholder }}</span>
                    <template v-else>
                        <el-tag
                                v-for="{ searchLabel, displayLabel } in selectedItem"
                                :key="searchLabel"
                                size="mini"
                                class="tag"
                        >
                            <v-node-render :nodes="displayLabel"/>
                        </el-tag>
                    </template>
                </template>
                <template v-else>
                    <span v-if="selectedItem.searchLabel === ''">{{ placeholder }}</span>
                    <span v-else>
                        <v-node-render :nodes="selectedItem.displayLabel"/>
                    </span>
                </template>
            </slot>
        </div>

        <div class="column">
            <span class="close-button" @click="isOpen = false">X</span>
            <el-input v-model="searchText" size="mini" placeholder="Pretraga..." ref="inputElement" v-if="searchable"/>
            <div class="clear-all-container" v-if="clearable">
                <span v-if="multiSelect" @click="deselectAllItems">Obriši sve</span>
                <span v-else @click="clearSingleSelection">Obriši</span>
            </div>
            <div v-if="multiSelect">
                <el-divider class="divider"/>
                <template v-if="selectedItem.length !== 0">
                    <div
                            class="el-select-dropdown__item item selected-item"
                            v-for="{ searchLabel, displayLabel, item } in selectedItem"
                            :key="searchLabel"
                    >
                        <div>
                            <slot :item="item">
                                <v-node-render :nodes="displayLabel"/>
                            </slot>
                        </div>
                        <i class="fas fa-times" @click="()=>deselectItem(item)"/>
                    </div>
                </template>
                <div v-else>
                    Odaberite opcije
                </div>
            </div>
            <el-divider class="divider"/>
            <div class="column items">
                <div
                        class="el-select-dropdown__item item"
                        :class="{selected: !multiSelect && selectedItem.searchLabel === item.searchLabel}"
                        v-for="item in filteredItems"
                        @click="() => selectItem(item)"
                        :key="item.searchLabel"
                >
                    <slot :item="item.item">
                        <v-node-render :nodes="item.displayLabel"/>
                    </slot>
                </div>
            </div>
        </div>
    </el-popover>
</template>

<style lang="sass" scoped>
    @import "./src/assets/styles/breakPoints"

    .tag
        margin-right: 5px

    .clear-all-container
        display: flex
        flex-direction: row
        justify-content: flex-end
        margin-top: 5px
        cursor: default

    .selected-item
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center
        cursor: default

    .selected-element
        padding: 5px
        width: unset
        line-height: unset
        height: unset
        cursor: default

    .items
        overflow-y: auto

        .item
            overflow: unset

    .column
        display: flex
        flex-direction: column
        flex-grow: 1
        min-height: 0

        .close-button
            display: none
            align-self: flex-end
            cursor: pointer
            margin-bottom: 5px
            @media($mobileBreakPoint)
                display: inline-block

        .divider
            margin: 7px 0

</style>

<style lang="sass">
    @import "./src/assets/styles/breakPoints"

    .t-select-dropdown-added-class
        display: flex
        flex-direction: column
        flex-grow: 1
        @media($mobileBreakPoint)
            width: 100%
            left: 0 !important
            top: 0 !important
            height: 100%
            box-sizing: border-box
            margin-top: 0 !important

</style>

<script>
    import _ from 'lodash'
    import { combineClasses } from '@/utils'
    import VNodeRender from '@/components/_common/vNodeRender.js'

    export default {
        name: 't-select',
        components: {
            VNodeRender,
        },
        props: {
            value: {},
            items: Array,
            /** (item | null) => string */
            getSearchLabel: Function,
            /** (item | null) => VNode */
            getDisplayLabel: Function,
            placeholder: String,
            dropdownClass: {},
            selectedItemsClass: {},
            multiSelect: Boolean,
            searchable: Boolean,
            clearable: Boolean,
        },
        data() {
            return {searchText: '', isOpen: false}
        },
        computed: {
            model: {
                get() {
                    if (this.multiSelect) {
                        return _.isNil(this.value) ? [] : this.value
                    }
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            },
            cashedItems() {
                return this.items.map((currentItem) => {
                    return {
                        searchLabel: this.getSearchLabel(currentItem),
                        displayLabel: this.getDisplayLabel(currentItem),
                        item: currentItem,
                    }
                })
            },
            selectedItem() {
                if (this.multiSelect) {
                    return this.model.map((currentItem) => {
                        return {
                            searchLabel: this.getSearchLabel(currentItem),
                            displayLabel: this.getDisplayLabel(currentItem),
                            item: currentItem,
                        }
                    })
                }
                return {
                    searchLabel: this.getSearchLabel(this.model),
                    displayLabel: this.getDisplayLabel(this.model),
                    item: this.model,
                }
            },
            selectSet() {
                if (this.multiSelect) {
                    return this.selectedItem.reduce((result, { searchLabel }) => {
                        result.add(searchLabel)
                        return result
                    }, new Set())
                }
                return new Set([this.selectedItem])
            },
            filteredItems() {
                let result = _(this.cashedItems)
                if (this.multiSelect) {
                    result = result.filter(({ searchLabel }) => {
                        return !this.selectSet.has(searchLabel)
                    })
                }
                result = result.filter(({ searchLabel }) => {
                    searchLabel = `${searchLabel}`.toLowerCase()
                    return searchLabel.includes(this.searchText.toLowerCase())
                })

                return result.value()
            },
            classesForPopper() {
                let ddClass = ''

                if (!_.isNil(this.dropdownClass)) {
                    ddClass = this.dropdownClass
                }
                return combineClasses(ddClass, 't-select-dropdown-added-class')
            }
        },
        methods: {
            selectItem(item) {
                if (this.multiSelect) {
                    this.model = [...this.model, item.item]
                } else {
                    this.model = item.item
                    this.isOpen = false
                }
                this.$emit('change')
            },
            deselectItem(item) {
                if (this.multiSelect) {
                    this.model = this.model.filter((currentItem) => currentItem !== item)
                }
                this.$emit('change')
            },
            deselectAllItems() {
                if (this.multiSelect && this.model.length !== 0) {
                    this.model = []
                }
                this.$emit('change')
            },
            clearSingleSelection() {
                if (!this.multiSelect && this.model !== null) {
                    this.model = null
                    this.isOpen = false
                }
                this.$emit('change')
            }
        },
        watch: {
            isOpen() {
                if (this.isOpen && !_.isNil(this.$refs.inputElement)) {
                    this.$nextTick(() => this.$refs.inputElement.focus())
                }

                if (!this.isOpen) {
                    this.$emit('close')
                }
            }
        }
    }
</script>
