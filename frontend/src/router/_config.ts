export const routeConfig = (ROUTES_ADMIN: any, decodeUserNow: any) => {
    return [
        {
            path: '/',
            name: 'login',
            component: () => import("../components/Auth/_MainAuth.vue"),
            redirect: '',
            children: [
                {
                    path: "",
                    name: "auth-login",
                    component: () => import("../components/Auth/Login.vue")
                },
                {
                    path: "confirm/:id",
                    name: "auth-confirm",
                    component: () => import("../components/Auth/Confirm.vue")
                },
                {
                    path: "register",
                    name: "auth-register",
                    component: () => import("../components/Auth/Register.vue")
                },
                {
                    path: "reset/:id",
                    name: "auth-reset",
                    component: () => import("../components/Auth/Reset.vue")
                },
                {
                    path: "recovery",
                    name: "auth-recovery",
                    component: () => import("../components/Auth/Recovery.vue")
                }
            ]
        },
        {
            path: "/dashboard",
            name: "dash-",
            component: () => import("../components/Dashboard/_MainDashboard.vue"),
            children: ROUTES_ADMIN(decodeUserNow(), {
                ADMIN: [
                    {
                        path: "",
                        name: "dash-admin-account",
                        component: () => import("../components/Dashboard/admin/ListAccountUsers.vue"),
                    },
                    {
                        path: "/select-encrypt",
                        name: "dash-select-encrypt",
                        component: () => import("../components/Dashboard/admin/TableTypeEncrypt.vue")
                    },
                    {
                        path: "/admin-resources",
                        name: "dash-admin-resources",
                        component: () => import("../components/Dashboard/admin/ListAdminResources.vue")
                    },
                    {
                        path: "/modify-profile-admin",
                        name: "dash-modify-profile-admin",
                        component: () => import("../components/Dashboard/admin/ModifyProfileAdmin.vue")
                    }
                ],
                USER: [
                    {
                        path: "/entries",
                        name: "dash-user-resources",
                        component: () => import("../components/Dashboard/user/ListUserResources.vue")
                    },
                    {
                        path: "/modify-profile-user",
                        name: "dash-user-form-modify-profile/:id",
                        component: import("../components/Dashboard/user/ModifyProfileUser.vue"),
                    },
                    {
                        path: "/form-generate-password",
                        name: "dash-user-form-generate-password",
                        component: import("../components/Dashboard/user/GeneratePassword.vue"),
                    }
                ]
            })
        }
    ];
}