<template>
    <div class="breadcrumb-container">
        <el-card shadow="never">
            <template v-for="(path, index) in allPathsExceptLast"> 
                <span :key="`sep-${index}`">/</span>
                <span :key="`name-${index}`">
                    <router-link :to="path.to">{{path.name}}</router-link>
                </span>
            </template>
            <span>/</span>
            <span v-if="hasLastPath">
                <router-link :to="lastPath.to">{{lastPath.name}}</router-link>
            </span>
        </el-card>
    </div>
</template>

<style lang="sass" scoped>
    .breadcrumb-container
        display: flex
        flex-direction: row
        & ::v-deep .el-card__body
            padding: 5px 15px 5px 5px
</style>

<script>
    import { Card as ElCard } from 'element-ui' 

    export default {
        name: 'breadcrumbs', 
        components: {
            ElCard,
        },
        props: {
            // [{to: Object, name: String}] 
            paths: {
                type: Array,
                default() {
                    return []
                },
            },
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
        }
    }
</script>

