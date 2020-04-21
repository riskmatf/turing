<template>
    <el-popover v-model="isOpen" trigger="click" content="test" :popper-class="classesForPopper" :visible-arrow="false">
        <div slot="reference" class="el-input__inner selected-element" :class="selectedItemsClass">
            <slot name="selectedItem">
                <span v-if="selectedLabel === ''">{{ placeholder }}</span>
                <span v-else>{{ selectedLabel }}</span>
            </slot>
        </div>

        <div class="column">
            <span class="close-button" @click="isOpen = false">X</span>
            <el-input v-model="searchText" size="mini" placeholder="Pretraga..." ref="inputElement"/>
            <el-divider class="divider"/>
            <div class="column items">
                <div
                    class="el-select-dropdown__item item"
                    :class="{selected: selectedLabel === item.label}"
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
        },
        data() {
            return { searchText: '', isOpen: false }
        },
        computed: {
            filteredItems() {
                return _.filter(this.cashedLabels, (item, label) => label.includes(this.searchText))
            },
            model: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            },
            cashedLabels() {
                return this.items.reduce((previousValue, currentValue) => {
                    const label = this.getLabel(currentValue)
                    previousValue[label] = { label: label, item: currentValue}
                    return previousValue
                }, {})
            },
            selectedLabel() {
                return this.getLabel(this.model)
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
                this.model = item.item
                this.isOpen = false
            }
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
