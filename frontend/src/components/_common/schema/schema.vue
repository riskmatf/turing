<template>
    <div class="schema">
        <object class="image" ref="schema" :data="schemaUrl" type="image/svg+xml" :style="schemaHiddenStyle"/>
    </div>
</template>

<style lang="sass" scoped>
    .schema
        width: 100%
        height: 100%
        .image
            object-fit: contain
            width: 100%
            height: 100%
</style>

<script>
    import _ from 'lodash'

    export default {
        name: 'schema',
        props: {
            schemaUrl: String,
            computers: Array,
        },
        data() {
            return {
                isSchemaReady: false
            }
        },
        methods: {
            checkIsSchemaLoaded() {
                this.schemaContent = { isLoaded: false, content: null }
                return new Promise((resolve) => {
                    const runner = () => {
                        const svgDocument = _.get(this.$refs, "schema.contentDocument", null)
                        if (!_.isNil(svgDocument) && svgDocument.getElementsByTagName('svg').length !== 0) {
                            this.schemaContent.isLoaded = true
                            this.schemaContent.content = this.$refs.schema.contentDocument
                            this.schemaLoad()
                            resolve()
                            return
                        }
                        setTimeout(runner, 100)
                    }
                    runner()
                })
            },
            schemaLoad() {
                if (!this.schemaContent.isLoaded) return

                this.computerMap = {}

                for (const computer of this.computers) {
                    const computerEl = this.schemaContent.content.getElementById(`comp_${computer.computerId}`)
                    const errorEl = this.schemaContent.content.getElementById(`err_${computer.computerId}`)
                    this.computerMap[computer.computerId] = {computerEl: computerEl, errorEl: errorEl}

                    computerEl.addEventListener('click', () => {
                        this.$emit('computerClick',  computer.computerId)
                    })
                }
            },
            setErrorVisibility(computerId, visible) {
                if (this.computerMap[computerId])  {
                    this.computerMap[computerId].errorEl.style.visibility = visible ? 'visible' : 'hidden'
                }
            },
            setBroken(computerId, broken) {
                if (this.computerMap[computerId])   {
                    const errorBackgroundEl =
                        this.computerMap[computerId].errorEl.getElementsByTagName('path')[0]

                    if (errorBackgroundEl) {
                        errorBackgroundEl.style.fill = broken ? 'red' : '#ffcc4d'
                    }
                }
            },
            updateErrorDisplay() {
                if (!this.schemaContent.isLoaded) return

                for (const computer of this.computers) {
                    if (computer.isBroken) {
                        this.setBroken(computer.computerId, true)
                        this.setErrorVisibility(computer.computerId, true)
                    } else {
                        this.setBroken(computer.computerId, false)
                        this.setErrorVisibility(computer.computerId, computer.hasReports)
                    }
                }
            },
        },
        computed: {
            schemaHiddenStyle() {
                return {
                    visibility: this.isSchemaReady ? 'visible' : 'hidden'
                }
            }
        },
        mounted() {
            this.isSchemaReady = false
            this.checkIsSchemaLoaded()
                .then(() => {
                    this.updateErrorDisplay()
                    this.isSchemaReady = true
                })
        },
        watch: {
            computers: {
                deep: true,
                handler() {
                    this.updateErrorDisplay()
                }
            }
        }
    }
</script>