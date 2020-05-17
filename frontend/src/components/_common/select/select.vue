<template>
    <el-popover v-model="isOpen" trigger="click" content="test" :popper-class="classesForPopper" :visible-arrow="false">
        <div slot="reference" class="el-input__inner selected-element" :class="selectedItemsClass">
            <slot name="selectedItem">
                <template v-if="multiSelect">
                    <span v-if="selectedLabel.length === 0">{{ placeholder }}</span>
                    <template v-else>
                        <el-tag
                            v-for="{ label } in selectedLabel"
                            :key="label"
                            size="mini"
                            class="tag"
                        >
                            {{ label }}
                        </el-tag>
                    </template>
                </template>
                <template v-else>
                    <span v-if="selectedLabel === ''">{{ placeholder }}</span>
                    <span v-else>{{ selectedLabel }}</span>
                </template>
            </slot>
        </div>

        <div class="column">
            <span class="close-button" @click="isOpen = false">X</span>
            <el-input v-model="searchText" size="mini" placeholder="Pretraga..." ref="inputElement"/>
            <div v-if="multiSelect">
                <div class="clear-all-container">
                    <span @click="deselectAllItems">Clear all</span>
                </div>
                <el-divider class="divider"/>
                <template v-if="selectedLabel.length !== 0">
                    <div
                            class="el-select-dropdown__item item selected-item"
                            v-for="{ label, item } in selectedLabel"
                            :key="label"
                    >
                        <div>
                            <slot :item="item">
                                {{ label }}
                            </slot>
                        </div>
                        <i class="fas fa-times" @click="()=>deselectItem(item)"/>
                    </div>
                </template>
                <div v-else>
                    Select some items
                </div>
            </div>
            <el-divider class="divider"/>
            <div class="column items">
                <div
                    class="el-select-dropdown__item item"
                    :class="{selected: !multiSelect && selectedLabel === item.label}"
                    v-for="item in filteredItems"
                    @click="() => selectItem(item)"
                    :key="item.label"
                >
                    <slot :item="item.item">
                        {{ item.label }}
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
            left: 0!important
            top: 0!important
            height: 100%
            box-sizing: border-box
            margin-top: 0!important

</style>

<script>
    import _ from 'lodash'
    import { combineClasses } from '@/utils'

    export default {
        name: 't-select',
        components: {
        },
        props: {
            value: {},
            items: Array,
            /** (item | null) => string */
            getLabel: Function,
            placeholder: String,
            dropdownClass: {},
            selectedItemsClass: {},
            multiSelect: Boolean,
        },
        data() {
            return { searchText: '', isOpen: false }
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
            cashedLabels() {
                return this.items.map((currentValue) => {
                    return { label: this.getLabel(currentValue), item: currentValue }
                })
            },
            selectedLabel() {
                if (this.multiSelect) {
                    return this.model.map((item) => {
                        return { label: this.getLabel(item), item: item }
                    })
                }
                return this.getLabel(this.model)
            },
            selectSet() {
                if (this.multiSelect) {
                    return this.selectedLabel.reduce((result, { label }) => {
                        result.add(label)
                        return result
                    }, new Set())
                }
                return new Set([this.selectedLabel])
            },
            filteredItems() {
                let result = _(this.cashedLabels)
                if (this.multiSelect) {
                    result = result.filter(({ label }) => {
                        return !this.selectSet.has(label)
                    })
                }
                result = result.filter(({label}) => {
                    return `${label}`.includes(this.searchText)
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
            },
            deselectItem(item) {
                if (this.multiSelect) {
                    this.model = this.model.filter((currentItem) => currentItem !== item)
                }
            },
            deselectAllItems() {
                if (this.multiSelect) {
                    this.model = []
                }
            },
        },
        watch: {
            isOpen() {
                if (this.isOpen && !_.isNil(this.$refs.inputElement)) {
                    this.$nextTick(() => this.$refs.inputElement.focus())
                }
            }
        }
    }
</script>
