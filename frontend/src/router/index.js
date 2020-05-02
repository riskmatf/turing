import Vue from 'vue'
import  VueRouter from 'vue-router'

// import { HomePage } from '@/components/user/homePage'
// import { ClassroomListPage } from '@/components/user/classroomListPage'
// import { ClassroomPage } from '@/components/user/classroomPage'

import store from "@/store";
import {
    HomePage,
    BaseLayout,
    ClassroomListPage,
    ClassroomPage,
    TutorialPage,
    ReportListPage,
    NotFoundPage,
} from '@/components/user'
import {
    LoginPage,
} from '@/components/admin'

Vue.use(VueRouter)
const RouterView = { render(createElement){return createElement('router-view')} }
const BaseComponent = {
    store: store,
    render(h) {
        return h('router-view')
    }
}
const routes = [
    {
        path: '/',
        component: BaseComponent,
        children: [
            {
                path: 'admin/login',
                component: LoginPage,
            },
            {
                path: '',
                component: BaseLayout,
                children: [
                    { path: '', name: 'homePage', component: HomePage, meta: { index: '1' }},
                    {
                        path: '/classrooms',
                        component: RouterView,
                        children: [
                            { path: '', name: 'classroomListPage', component: ClassroomListPage, meta: { index: '2' } },
                            {
                                path: ':classroomId',
                                component: RouterView,
                                children: [
                                    { path: '', name: 'classroomPage', component: ClassroomPage, meta: { index: '2' }},
                                    { path: ':computerId', name: 'reportListPage', component: ReportListPage, meta: { index: '2' } }
                                ]
                            },
                        ]
                    },
                    { path: '/tutorial', name: 'tutorialPage', component: TutorialPage, meta: { index: '3' }},
                    { path: '/*', name: 'notFound', component: NotFoundPage }
                ]
            }
        ],
    },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
