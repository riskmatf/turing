import Vue from 'vue'
import  VueRouter from 'vue-router'
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
    BaseLayout as AdminBaseLayout,
    HomePage as AdminHomePage,
    ClassroomListPage as AdminClassroomListPage,
    ClassroomPage as AdminClassroomPage,
    ReportListPage as AdminReportListPage,
    SettingsPage,
    AddNewAdminPage,
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
                name: 'adminLogin',
                component: LoginPage,
            },
            {
                path: 'admin',
                component: AdminBaseLayout,
                children: [
                    { path: '', name: 'adminHomePage', component: AdminHomePage, meta: {index: '01'} },
                    {
                        path: 'classrooms',
                        component: RouterView,
                        children: [
                            { path: '', name: 'adminClassroomListPage', component: AdminClassroomListPage, meta: { index: '03' } },
                            {
                                path: ':classroomId',
                                component: RouterView,
                                children: [
                                    { path: '', name: 'adminClassroomPage', component: AdminClassroomPage, meta: { index: '03'} },
                                    { path: ':computerId', name: 'adminReportListPage', component: AdminReportListPage, meta: { index: '03' } }
                                ]
                            },
                        ]
                    },
                    { path: 'settings', name: 'adminSettingsPage', component: SettingsPage, meta: { index: '04-1' }},
                    { path: 'addAdmin', name: 'addNewAdminPage', component: AddNewAdminPage, meta: { index: '04-2' }},
                    { path: '*', name: 'adminNotFound', component: NotFoundPage },
                ]
            },
            {
                path: '',
                component: BaseLayout,
                children: [
                    { path: '', name: 'homePage', component: HomePage, meta: { index: '1' } },
                    {
                        path: 'classrooms',
                        component: RouterView,
                        children: [
                            { path: '', name: 'classroomListPage', component: ClassroomListPage, meta: { index: '2' } },
                            {
                                path: ':classroomId',
                                component: RouterView,
                                children: [
                                    { path: '', name: 'classroomPage', component: ClassroomPage, meta: { index: '2' } },
                                    { path: ':computerId', name: 'reportListPage', component: ReportListPage, meta: { index: '2' } }
                                ]
                            },
                        ]
                    },
                    { path: 'tutorial', name: 'tutorialPage', component: TutorialPage, meta: { index: '3' } },
                    { path: '*', name: 'notFound', component: NotFoundPage }
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

router.beforeEach((to, from, next) => {
    if (!to.fullPath.startsWith('/admin') || to.name === 'adminLogin') {
        next()
        return
    }

    if (!store.state.Admin.Admin.isAdminLoggedIn) {
        next({ name: 'adminLogin', query: { to: to.fullPath } })
        return
    }
    if (store.state.Admin.Admin.adminData.username !== Vue.cookie.get('loggedInUsername')) {
        store.commit('Admin/Admin/clearLoginState')
        next({ name: 'adminLogin', query: { to: to.fullPath } })
        return
    }
    next()
})

export default router
