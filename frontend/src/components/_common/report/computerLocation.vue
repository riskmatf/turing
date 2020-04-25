<template>
    <el-popover v-model="isOpen" popper-class="computer-location-popup" :visible-arrow="false">
        <div slot="reference" class="el-icon-location-information"></div>
        <div class="column">
            <div class="el-icon-close close-button" @click="isOpen=false"></div>
            <schema v-if="isOpen" :schema-url="schemaUrl" :computers="computers" class="center"/>
        </div>
    </el-popover>
</template>

<style lang="sass" scoped>
    @import './src/assets/styles/breakPoints'

    .column
        display: flex
        flex-direction: column
        height: 100%
    .center
        justify-self: center
    .close-button
        display: none
        @media ($mobileBreakPoint)
            display: block
</style>

<style lang="sass">
    @import './src/assets/styles/breakPoints'

    .computer-location-popup
        width: 200px
        @media ($mobileBreakPoint)
            box-sizing: border-box
            width: 100%
            height: 100%
            top: 0!important
            left: 0!important
            margin-top: 0!important
</style>

<script>
    import { Schema } from '@/components/_common/schema'

    export default {
        components: {
            Schema,
        },
        props: {
            computerId: Number,
            schemaUrl: String,
            numberOfComputers: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                isOpen: false,
            }
        },
        computed: {
            computers() {
                const computers = []
                for (let i = 0; i < this.numberOfComputers; i++) {
                    computers.push({ computerId: i, isBroken: false, hasReports: i === this.computerId })
                }

                return computers
            }
        }
    }
</script>