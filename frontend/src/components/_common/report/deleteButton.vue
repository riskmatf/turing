<template>
    <el-button size="mini" :disabled="disabled" type="danger" @click="$emit('click')">
        Obrisi kvar
    </el-button>
</template>

<style lang="sass" scoped>
</style>

<script>
    export default {
        props: {
            disabled: Boolean,
        }
    }
</script>

