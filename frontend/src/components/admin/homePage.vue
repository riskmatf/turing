<template>
    <div class="home-container">
        <h1> Turing logo </h1>
        <el-card>
            Dobrodosli na platformu Turing, admine.
        </el-card>
    </div>
</template>

<style lang="sass" scoped>
    .home-container
        display: flex
        flex-direction: column
        flex-grow: 1
        align-items: center
        margin-top: 100px
</style>

<script>
    import { Card } from 'element-ui'

    export default {
        name: 'homePage',
        components: {
            ElCard: Card,
        },
    }
</script>