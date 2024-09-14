import JWT from "jsonwebtoken";
import User from "../Model/User.model"
import UserResource from "../Model/UserResource.model"
import { varsConfig } from "../../Helpers/varsConfig";
import AdminResource from "../Model/AdminResource.model"
import { decodeTokenUser } from "../../Helpers/generateHash";

export const userCreateResource = async (req: any, res: any) => {

    const { id_user_ref, name_resource_admin, id_resource_admin, inputs_data } = req.body;

    let arr_errors: any = [];

    if (id_user_ref === undefined) arr_errors.push("Se necesita el ID del usuario registrado para realizar esta acción");
    if (name_resource_admin === undefined) arr_errors.push("Se necesita el Nombre del recurso proveído por el Administrador");
    if (id_resource_admin === undefined) arr_errors.push("Se necesita el ID del recurso proveído por el Administrador");
    if (inputs_data === undefined) arr_errors.push("No se ha encontrado el objeto que contendrá la información de los campos")
    else if (inputs_data.length === 0) arr_errors.push("Se necesita tener uno o más campos llenados");

    if (arr_errors.length > 0) res.status(404).json({ ok: false, errors: arr_errors })
    else {

        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

        await User.findOne({ _id: HEADER._id, isAdmin: false }).exec().then(async (user_data: any) => {
            if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
            else {
                const src: any = await new UserResource();
                src.id_user_ref = user_data._id;

                AdminResource.findOne({ _id: id_resource_admin, name_resource: name_resource_admin }).exec().then(async (user_admin_data: any) => {
                    if (!user_admin_data) res.status(404).json({ ok: false, msg: "No se ha podido encontrar el nombre del recurso a aplicar. Prueba con otro" })
                    else {
                        src.name_resource_admin = name_resource_admin;
                        src.id_resource_admin = id_resource_admin;
                        src.inputs_data = inputs_data;

                        let obj_fields: any = {};

                        if (user_admin_data.name_type_encrypt === "JWT") {
                            obj_fields = JWT.sign(src.inputs_data, varsConfig.JWT_STR, { expiresIn: "10 days" });
                            src.inputs_data = obj_fields;
                            src.save();
                            res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso", data: src });

                        } else if (user_admin_data.name_type_encrypt === "BASE 64") {

                            obj_fields = btoa(JSON.stringify(src.inputs_data));
                            src.inputs_data = obj_fields;
                            src.save();
                            res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });
                        }
                    }
                });
            }
        });
    }
}

export const userGetResources = async (req: any, res: any) => {

    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

    await User.findOne({ _id: HEADER._id, isAdmin: false }).exec().then(async (user_data: any) => {
        if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
        else {
            await UserResource.findOne({ id_user_ref: HEADER._id }).select(["-__v"]).exec().then(async (user_admin_resource: any) => {
                if (!user_admin_resource) res.status(404).json({ ok: false, msg: "No hay datos almacenados.", data: [] })
                else {
                    await UserResource.find({ id_user_ref: HEADER._id }).populate('id_resource_admin').select(["-__v"]).exec().then(async (user_data: any) => {
                        if (user_data.length === 0) res.status(404).json({ ok: false, msg: "No hay datos almacenados.", data: [] })
                        else {
                            user_data.forEach((e: any) => {
                                if (e.id_resource_admin?.name_type_encrypt === "JWT") {

                                    if (!e.inputs_data.includes(".") && !e.inputs_data.includes("_") && !e.inputs_data.includes("-")) {
                                        const DECODE: any = JSON.parse(atob(e.inputs_data))

                                        let CODE = JWT.sign(DECODE, varsConfig.JWT_STR, { expiresIn: "10 days" });

                                        e.inputs_data = JWT.verify(CODE, varsConfig.JWT_STR);

                                    } else {
                                        e.inputs_data = JWT.verify(e.inputs_data, varsConfig.JWT_STR);
                                    }

                                } else if (e.id_resource_admin?.name_type_encrypt === "BASE 64") {

                                    if (e.inputs_data.includes(".") || e.inputs_data.includes("_") || e.inputs_data.includes("-")) {
                                        const DECODE: any = JWT.verify(e.inputs_data, varsConfig.JWT_STR);
                                        delete DECODE.iat;
                                        delete DECODE.exp;
                                        let CODE = btoa(JSON.stringify(DECODE));
                                        e.inputs_data = JSON.parse(atob(CODE));
                                    } else {
                                        e.inputs_data = JSON.parse(atob(e.inputs_data));
                                    }
                                }
                            });
                            res.status(201).json({ ok: true, msg: "Los datos han sido obtenidos", data: user_data })
                        }
                    });
                }
            });
        }
    });
}

export const userGetResourceById = async (req: any, res: any) => {
    await UserResource.findOne({ _id: req.params.id }).populate('resource_admin_id').select(["-__v"]).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No hay datos almacenados." })
        else {

        }
    });
}

export const userEditResource = async (req: any, res: any) => {

    const { id_user_ref, name_resource_admin, id_resource_admin, inputs_data } = req.body;

    let arr_errors: any = [];

    if (id_user_ref === undefined) arr_errors.push("Se necesita el ID del usuario registrado para realizar esta acción");
    if (name_resource_admin === undefined) arr_errors.push("Se necesita el Nombre del recurso proveído por el Administrador");
    if (id_resource_admin === undefined) arr_errors.push("Se necesita el ID del recurso proveído por el Administrador");
    if (inputs_data === undefined) arr_errors.push("No se ha encontrado el objeto que contendrá la información de los campos")
    else if (inputs_data.length === 0) arr_errors.push("Se necesita tener uno o más campos llenados");

    if (arr_errors.length > 0) res.status(404).json({ ok: false, errors: arr_errors })
    else {
        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

        await User.findOne({ _id: HEADER._id, isAdmin: false }).exec().then(async (user_data: any) => {
            if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
            else {
                UserResource.findOne({ _id: req.params.id, id_user_ref: HEADER._id }).exec().then(async (user_data: any) => {
                    if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                    else {
                        const new_data: any = {};
                        new_data.id_user_ref = HEADER._id;
                        new_data.id_resource_admin = user_data.id_resource_admin;
                        new_data.name_resource_admin = user_data.name_resource_admin;

                        AdminResource.findOne({ _id: user_data.id_resource_admin }).exec().then(async (user_admin_data: any) => {
                            if (user_admin_data.name_type_encrypt === "JWT") {

                                const DECODE: any = JWT.verify(user_data.inputs_data, varsConfig.JWT_STR)

                                delete DECODE.iat;
                                delete DECODE.exp;

                                for (let i in DECODE) {
                                    if (inputs_data[i] === undefined) {
                                        DECODE[i] = DECODE[i]
                                    } else {
                                        DECODE[i] = inputs_data[i]
                                    }
                                }

                                new_data.inputs_data = JWT.sign(DECODE, varsConfig.JWT_STR, { expiresIn: "10 days" });

                                UserResource.findOneAndUpdate({ _id: req.params.id, id_user_ref: HEADER._id }, new_data).exec().then((success: any) => {
                                    res.status(201).json({ ok: true, msg: "Se ha actualizado el recurso" })
                                });

                            } else if (user_admin_data.name_type_encrypt === "BASE 64") {

                                const DECODE = JSON.parse(atob(user_data.inputs_data));

                                for (let i in DECODE) {
                                    if (inputs_data[i] === undefined) {
                                        DECODE[i] = DECODE[i]
                                    } else {
                                        DECODE[i] = inputs_data[i]
                                    }
                                }

                                new_data.inputs_data = btoa(JSON.stringify(DECODE));

                                UserResource.findOneAndUpdate({ _id: req.params.id, id_user_ref: HEADER._id }, new_data).exec().then((success: any) => {
                                    res.status(201).json({ ok: true, msg: "Se ha actualizado el recurso" })
                                });
                            }
                        });
                    }
                });
            }
        })
    }
}

export const userDeleteResource = async (req: any, res: any) => {

    const { id_user_ref } = req.body;

    let arr_errors: any = [];

    if (id_user_ref === undefined) arr_errors.push("Se necesita el ID del usuario registrado para realizar esta acción");

    if (arr_errors.length > 0) res.status(404).json({ ok: false, errors: arr_errors })
    else {

        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

        await User.findOne({ _id: HEADER._id, isAdmin: false }).exec().then(async (user_data: any) => {
            if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
            else {
                UserResource.findOne({ _id: req.params.id, id_user_ref: HEADER._id }).exec().then(async (user_admin_data_ref: any) => {
                    if (!user_admin_data_ref) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                    else {
                        UserResource.findByIdAndDelete({ _id: req.params.id }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "El recurso seleccionado ha sido eliminado" }));
                    }
                });
            }
        });
    }
}