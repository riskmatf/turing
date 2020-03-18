<template>
    <div>
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
    </div>
</template>

<style lang="sass" scoped>
    // TODO: Style breadcrumb
</style>

<script>
    export default {
        name: 'breadcrumbs', 
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

