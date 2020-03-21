<template>
    <el-image :src="classroomImageUrl" class="classroom-image" fit="scale-down"/>
</template>

<style lang="sass" scoped>
    .classroom-image
        width: 100%

</style>

<script>
    import { Image as ElImage } from 'element-ui'

    export default {
        components: {
            ElImage,
        },
        props: {
            classroomImageUrl: String,
        },
    }
</script>