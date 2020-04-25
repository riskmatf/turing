<template>
    <div> {{ typeSentence }} </div>
</template>

<style lang="sass" scoped>

</style>

<script>
    export default {
        props: {
            reportId: Number,
            isGeneral: Boolean,
            computerId: Number,
            classroomId: String,
        },
        computed: {
            typeSentence() {
                let res = `Prijavljen kvar #${this.reportId} u ucionici ${this.classroomId} `

                if (!this.isGeneral) {
                    res += `na racunaru ${this.computerId}`
                }

                return res
            }
        }
    }
</script>