<template>
    <div class="home-container">
        <h1 >Turing logo</h1>
        <el-card class="content">
            <template v-slot:header>
                <div>Turing</div>
            </template>
            <div>
                Projekat Turing je platforma namenjena prikazivanju informacija o računarskoj opremi u okviru Matematičkog fakulteta.
                Platforma u realnom vremenu omogućava administratorima i korisnicima da prate i ažuriraju stanje računarske opreme.
                Projekat je izveden u okviru organizacije RISK sa ciljem da unapredi funkcionisanje Računarske laboratorije
                i olakša održavanje računarske opreme.
            </div>
        </el-card>
        <div class="content">

        </div>
    </div>
</template>

<style lang="sass">
    @import "src/assets/styles/colors"
    @import "src/assets/styles/breakPoints"

    .home-container
        display: flex
        flex-direction: column
        flex-grow: 1
        align-items: center
        margin-top: 100px
        @media($mobileBreakPoint)
            margin-top: 25px
        .content
            width: 50%
            @media($mobileBreakPoint)
                width: 90%

</style>

<script>
    import { Card } from 'element-ui'
    export default {
        name: 'home',
        components: {
            ElCard: Card,
        },
    }
</script>