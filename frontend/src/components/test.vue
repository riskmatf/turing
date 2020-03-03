<template>
    <h1>hello</h1>
</template>

<style lang="sass" scoped>
</style>

<script>
    import axios from 'axios'
    export default {
        name: 'test',
        created() {
            axios.get('http://turing.dev.matf.bg.ac.rs:3000/api/v1')
            .then((resp) => {
                console.log(resp)
            })
        }
    }
</script>