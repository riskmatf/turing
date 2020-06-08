<template>
    <div class="home-container">
        <img src="@/assets/logo.jpeg"/>
        <el-card>
            Dobrodošli na platformu Turing,  <b>{{ adminDisplayName }}</b>.
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
    import { mapGetters } from 'vuex'

    export default {
        name: 'homePage',
        components: {
            ElCard: Card,
        },
        computed: {
            ...mapGetters('Admin/Admin', ['adminDisplayName'])
        }
    }
</script>