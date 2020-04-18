<template>
    <el-breadcrumb class="breadcrumb-container">
        <template v-for="(path, index) in allPathsExceptLast">
            <el-breadcrumb-item v-if="isSinglePath(path)" :to="path.to" :key="path.name">
                {{ path.name }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else :key="index">
                <multiple-paths :paths="path.children" :current-label="path.currentName"/>
            </el-breadcrumb-item>
        </template>
        <template v-if="hasLastPath">
            <el-breadcrumb-item v-if="isSinglePath(lastPath)">
                {{ lastPath.name }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else>
                <multiple-paths :paths="lastPath.children" :current-label="lastPath.currentName"/>
            </el-breadcrumb-item>
        </template>
    </el-breadcrumb>
</template>

<style lang="sass" scoped>
    .breadcrumb-container
        display: flex
        flex-direction: row
        align-items: center
    .el-select
        width: 6rem
</style>

<script>
    import _ from 'lodash'
    import MultiplePaths from './multiplePaths'

    export default {
        name: 'breadcrumbs', 
        components: {
            MultiplePaths,
        },
        props: {
            /**
             * [
             *  { to: Object, name: String } |
             *  {children: [{ to: Object, name: String }], currentName: String}
             * ]
             */
            paths: {
                type: Array,
                default() {
                    return []
                },
            },
        },
        data() {
            return { currentSelected: 0 }
        },
        computed: {
            allPathsExceptLast() {
                return this.paths.slice(0, this.paths.length-1)
            },
            lastPath() {
                return this.hasLastPath ? this.paths[this.paths.length-1] : null
            },
            hasLastPath() {
                return this.paths.length > 0
            }
        },
        methods: {
            isSinglePath(path) {
                return !_.isNil(path.to)
            }
        }
    }
</script>

