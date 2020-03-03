<template>
    <h1>hello</h1>
</template>

<style lang="sass" scoped>
</style>

<script>
    export default {
        name: 'test',
        created() {
            this.$http.get('/')
            .then((resp) => {
                console.log(resp)
            })
        }
    }
</script>