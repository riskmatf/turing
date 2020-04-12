import Vue from 'vue'
import  VueRouter from 'vue-router'

// import { HomePage } from '@/components/user/homePage'
// import { ClassroomListPage } from '@/components/user/classroomListPage'
// import { ClassroomPage } from '@/components/user/classroomPage'

import {
    HomePage,
    BaseLayout,
    ClassroomListPage,
    ClassroomPage,
    TutorialPage,
    ComputerPage,

} from '@/components/user'

Vue.use(VueRouter)

const RouterView = { render(createElement){return createElement('router-view')} }

const routes = [
    {
        path: '/',
        component: BaseLayout,
        children: [
            { path: '', name: 'homePage', component: HomePage },
            {
                path: '/classrooms',
                component: RouterView,
                children: [
                    { path: '', name: 'classroomListPage', component: ClassroomListPage },
                    {
                        path: ':classroomId',
                        component: RouterView,
                        children: [
                            { path: '', name: 'classroomPage', component: ClassroomPage},
                            { path: ':computerId', name: 'computerPage', component: ComputerPage }
                        ]
                    },
                ]
            },
            { path: '/tutorial', name: 'tutorialPage', component: TutorialPage},
        ]
    }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
