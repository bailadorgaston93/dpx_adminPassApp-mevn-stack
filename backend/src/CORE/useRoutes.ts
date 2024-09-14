import JWT from "jsonwebtoken";

import { varsConfig } from "../Helpers/varsConfig";
import { decodeTokenUser } from "../Helpers/generateHash";
import { getUsers, desactivateUser, editProfileUser } from "../CORE/Controller/User.controller";
import { registerUser, confirmAccount, loginUser, recoveryUser, resetPasswordUser } from "../CORE/Controller/Auth.controller";
import { userCreateResource, userGetResources, userEditResource, userDeleteResource, userGetResourceById } from "../CORE/Controller/UserResource.controller";
import { adminCreateResource, adminGetResources, adminEditResource, userGetResourceAdminById, adminDeleteResource, adminChangeTypeEncryptResource } from "../CORE/Controller/AdminResource.controller";

const authMiddleware = (req: any, res: any, next: any) => {

    if (req.headers.usuario_autorizacion) {
        JWT.verify(req.headers.usuario_autorizacion, varsConfig.JWT_STR, (err: any, userId: any) => {
            if (err) {
                res.status(404).json({ isExpired: true, ok: false, msg: "El token ha expirado. Vuelva a ingresar para continuar" });
            } else {
                req.user = JWT.verify(req.headers.usuario_autorizacion, varsConfig.JWT_STR);
                next();
            }
        });
    } else {
        res.status(403).json({
            ok: false,
            msg: "No se encuentra el token en el Header de la petición"
        });
    }
}

export const useRoutes = (app: any, router: any): Object => {

    return {
        AUTH_REGISTER: app.use(router.post(`${varsConfig.URI_AUTH[0]}`, registerUser)),
        AUTH_CONFIRM_ACCOUNT: app.use(router.get(`${varsConfig.URI_AUTH[1]}`, confirmAccount)),
        AUTH_LOGIN: app.use(router.post(`${varsConfig.URI_AUTH[2]}`, loginUser)),
        AUTH_RECOVERY: app.use(router.post(`${varsConfig.URI_AUTH[3]}`, recoveryUser)),
        AUTH_RESET: app.use(router.post(`${varsConfig.URI_AUTH[4]}`, resetPasswordUser)),

        USER_GET: app.use(router.get(`${varsConfig.URI_USER[0]}`, authMiddleware, getUsers)),
        USER_DESACTIVATE: app.use(router.put(`${varsConfig.URI_USER[1]}`, authMiddleware, desactivateUser)),
        USER_EDIT_PROFILE: app.use(router.put(`${varsConfig.URI_USER[2]}`, authMiddleware, editProfileUser)),

        ADMIN_CRETE_RESOURCE: app.use(router.post(`${varsConfig.URI_ADMIN_RESOURCE[0]}`, authMiddleware, adminCreateResource)),
        ADMIN_GET_RESOURCES: app.use(router.get(`${varsConfig.URI_ADMIN_RESOURCE[1]}`, authMiddleware, adminGetResources)),
        ADMIN_EDIT_RESOURCE: app.use(router.put(`${varsConfig.URI_ADMIN_RESOURCE[2]}`, authMiddleware, adminEditResource)),
        ADMIN_GET_RESOURCE_BY_ID: app.use(router.get(`${varsConfig.URI_ADMIN_RESOURCE[3]}`, authMiddleware, userGetResourceAdminById)),
        ADMIN_EDIT_TYPE_ENCRYPT_RESOURCE: app.use(router.put(`${varsConfig.URI_ADMIN_RESOURCE[4]}`, authMiddleware, adminChangeTypeEncryptResource)),
        ADMIN_DELETE_RESOURCE: app.use(router.delete(`${varsConfig.URI_ADMIN_RESOURCE[5]}`, authMiddleware, adminDeleteResource)),

       
        USER_CRETE_RESOURCE: app.use(router.post(`${varsConfig.URI_USER_RESOURCE[0]}`, authMiddleware, userCreateResource)),
        USER_GET_RESOURCES: app.use(router.get(`${varsConfig.URI_USER_RESOURCE[1]}`, authMiddleware, userGetResources)),
        USER_GET_RESOURCE_BY_ID: app.use(router.get(`${varsConfig.URI_USER_RESOURCE[2]}`, authMiddleware, userGetResourceById)),
        USER_EDIT_RESOURCE: app.use(router.put(`${varsConfig.URI_USER_RESOURCE[3]}`, authMiddleware, userEditResource)),
        USER_DELETE_RESOURCE: app.use(router.delete(`${varsConfig.URI_USER_RESOURCE[4]}`, authMiddleware, userDeleteResource)),
    };
}
