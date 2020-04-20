<template>
    <div>{{ localDateFormat }}</div>
</template>

<style lang="sass" scoped>

</style>

<script>

    export default {
        props: {
            reportDate: Number,
        },
        computed: {
            localDateFormat() {
                const date = new Date(this.reportDate*1000)

                return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
            }
        }
    }
</script>