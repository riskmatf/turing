<template>
    <div> Admin: {{ adminDisplayName }} </div>
</template>

<style lang="sass" scoped>

</style>

<script>
    export default {
        props: {
            adminDisplayName: String,
        }
    }
</script>