import User from "../Model/User.model"
import AdminResource from "../Model/AdminResource.model"
import { decodeTokenUser } from "../../Helpers/generateHash";
import UserResourceModel from "../Model/UserResource.model";

export const adminCreateResource = async (req: any, res: any) => {

    const { id_user_ref, name_resource, name_type_encrypt, fields } = req.body;

    let arr_errors: any = [];

    if (id_user_ref === undefined) arr_errors.push("Se necesita el ID del usuario registrado para realizar esta acción");
    if (name_resource === undefined) arr_errors.push("Se necesita el campo Nombre de recurso");
    if (name_type_encrypt === undefined) arr_errors.push("Se necesita el Nombre del tipo de encriptado (BASE 64 | JWT) que desea usar");
    if (fields === undefined) arr_errors.push("No se ha encontrado el objeto que contendrá la información de los campos")
    else if (fields.length === 0) arr_errors.push("Se necesita tener uno o más campos enlistados");

    if (arr_errors.length > 0) res.status(404).json({ ok: false, errors: arr_errors })
    else {

        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

        await User.findOne({ _id: HEADER._id, isAdmin: true }).exec().then(async (user_data: any) => {
            if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
            else {
                const src: any = await new AdminResource();
                let regex_specials = /[0123456789!”@#$%&‘()ÑÁÉÍÓÚáéíóúñ*+,-./^ ´_`{|}~[\]:;=?<>]/g;
                src.id_user_ref = user_data._id;

                AdminResource.findOne({ name_resource: name_resource, id_user_ref: HEADER._id }).exec().then(async (user_admin_data: any) => {
                    if (user_admin_data) res.status(404).json({ ok: false, msg: "Ya se encuentra un recurso con ese nombre" })
                    else {
                        src.name_resource = name_resource;
                        src.name_type_encrypt = name_type_encrypt;

                        let new_fields: any = [];

                        fields.forEach((e: any, i: number) => {
                            delete e._id;
                            e.name_input = e.label_input.toLowerCase().replace(regex_specials, "_");
                            new_fields.push(e)
                        });

                        new_fields.unshift({
                            label_input: "Nombre del recurso",
                            name_input: "nombre_del_recurso",
                            type_input: "text",
                        });

                        src.fields = new_fields;

                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });
                    }
                });
            }
        });
    }
}

export const adminGetResources = async (req: any, res: any) => {

    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

    await User.findOne({ _id: HEADER._id }).exec().then(async (user_data: any) => {
        if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
        else {
            await AdminResource.find({}).select(["-__v"]).exec().then((data: any) => {
                if (data.length === 0) res.status(404).json({ ok: false, msg: "No hay datos almacenados.", data: [] })
                else res.status(201).json({ ok: true, msg: "Los datos han sido obtenidos", data: data })
            });
        }
    });
}

export const adminEditResource = async (req: any, res: any) => {

    const { id_user_ref, name_resource } = req.body;

    let arr_errors: any = [];

    if (id_user_ref === undefined) arr_errors.push("Se necesita el ID del usuario registrado para realizar esta acción");
    if (name_resource === undefined) arr_errors.push("Se necesita el campo Nombre de recurso");

    if (arr_errors.length > 0) res.status(404).json({ ok: false, errors: arr_errors })
    else {

        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

        await User.findOne({ _id: HEADER._id, isAdmin: true }).exec().then(async (user_data: any) => {
            if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
            else {
                AdminResource.findOne({ _id: req.params.id }).exec().then(async (user_admin_data: any) => {
                    if (!user_admin_data) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                    else {
                        if (user_admin_data.name_resource === "Tipo de contraseña" || user_admin_data.name_resource === "Tipo de tarjeta" || user_admin_data.name_resource === "Nota") res.status(404).json({ ok: false, msg: `El recurso ${user_admin_data.name_resource} es creado por defecto y no puede ser modificado` })
                        else {
                            AdminResource.findOne({ _id: req.params.id, id_user_ref: HEADER._id }).exec().then(async (user_admin_data_ref: any) => {
                                if (!user_admin_data_ref) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                                else {
                                    const new_data: any = {};
                                    if (name_resource === user_admin_data.name_resource) {
                                        new_data.id_user_ref = HEADER._id;
                                        new_data.name_resource = user_admin_data_ref.name_resource;
                                        new_data.fields = user_admin_data_ref.fields;
                                        new_data.name_type_encrypt = user_admin_data_ref.name_type_encrypt;

                                        AdminResource.findOneAndUpdate({ _id: req.params.id, id_user_ref: HEADER._id }, new_data).exec().then((success: any) => {
                                            res.status(201).json({ ok: true, msg: "No has modificado nada, no obstante se ha actualizado el recurso" })
                                        });

                                    } else {
                                        new_data.id_user_ref = HEADER._id;
                                        new_data.name_resource = name_resource;
                                        new_data.fields = user_admin_data_ref.fields;
                                        new_data.name_type_encrypt = user_admin_data_ref.name_type_encrypt;

                                        AdminResource.findOneAndUpdate({ _id: req.params.id, id_user_ref: HEADER._id }, new_data).exec().then((success: any) => {
                                            res.status(201).json({ ok: true, msg: "Cambios aplicados, se ha actualizado el recurso" })
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}

export const userGetResourceAdminById = async (req: any, res: any) => {
    await AdminResource.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No hay datos almacenados." })
        else res.status(201).json({ ok: true, msg: "Los datos han sido obtenidos", data: data })
    });
}

export const adminChangeTypeEncryptResource = async (req: any, res: any) => {

    const { id_user_ref, name_type_encrypt } = req.body;

    let arr_errors: any = [];

    if (id_user_ref === undefined) arr_errors.push("Se necesita el ID del usuario registrado para realizar esta acción");
    if (name_type_encrypt === undefined) arr_errors.push("Se necesita el Nombre del tipo de encriptado (BASE 64 | JWT) que desea usar");

    if (arr_errors.length > 0) res.status(404).json({ ok: false, errors: arr_errors })
    else {

        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

        await User.findOne({ _id: HEADER._id, isAdmin: true }).exec().then(async (user_data: any) => {
            if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
            else {
                AdminResource.findOne({ _id: req.params.id }).exec().then(async (user_admin_data: any) => {
                    if (!user_admin_data) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                    else {
                        if (user_admin_data.name_resource === "Tipo de contraseña" || user_admin_data.name_resource === "Tipo de tarjeta" || user_admin_data.name_resource === "Nota") res.status(404).json({ ok: false, msg: `El recurso ${user_admin_data.name_resource} es creado por defecto y no puede ser modificado` })
                        else {
                            AdminResource.findOne({ _id: req.params.id, id_user_ref: HEADER._id }).exec().then(async (user_admin_data_ref: any) => {
                                if (!user_admin_data_ref) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                                else {
                                    const new_data: any = {};
                                    if (name_type_encrypt === user_admin_data.name_type_encrypt) {
                                        new_data.id_user_ref = HEADER._id;
                                        new_data.name_resource = user_admin_data_ref.name_resource;
                                        new_data.fields = user_admin_data_ref.fields;
                                        new_data.name_type_encrypt = user_admin_data_ref.name_type_encrypt;

                                        AdminResource.findOneAndUpdate({ _id: req.params.id, id_user_ref: HEADER._id }, new_data).exec().then((success: any) => {
                                            res.status(201).json({ ok: true, msg: "No has modificado nada, no obstante se ha actualizado el recurso" })
                                        });

                                    } else {
                                        new_data.id_user_ref = HEADER._id;
                                        new_data.name_resource = user_admin_data_ref.name_resource;
                                        new_data.fields = user_admin_data_ref.fields;
                                        new_data.name_type_encrypt = name_type_encrypt;

                                        AdminResource.findOneAndUpdate({ _id: req.params.id, id_user_ref: HEADER._id }, new_data).exec().then((success: any) => {
                                            res.status(201).json({ ok: true, msg: "Cambios aplicados, se ha actualizado el recurso" })
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}

export const adminDeleteResource = async (req: any, res: any) => {

    const { id_user_ref } = req.body;

    let arr_errors: any = [];

    if (id_user_ref === undefined) arr_errors.push("Se necesita el ID del usuario registrado para realizar esta acción");

    if (arr_errors.length > 0) res.status(404).json({ ok: false, errors: arr_errors })
    else {

        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

        await User.findOne({ _id: HEADER._id, isAdmin: true }).exec().then(async (user_data: any) => {
            if (!user_data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID o no tiene permiso" })
            else {
                AdminResource.findOne({ _id: req.params.id }).exec().then(async (user_admin_data: any) => {
                    if (!user_admin_data) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                    else {
                        if (user_admin_data.name_resource === "Tipo de contraseña" || user_admin_data.name_resource === "Tipo de tarjeta" || user_admin_data.name_resource === "Nota") res.status(404).json({ ok: false, msg: `El recurso ${user_admin_data.name_resource} es creado por defecto y no puede ser eliminado` })
                        else {
                            AdminResource.findOne({ _id: req.params.id, id_user_ref: HEADER._id }).exec().then(async (user_admin_data_ref: any) => {
                                if (!user_admin_data_ref) res.status(404).json({ ok: false, msg: "No se ha encontrado ningún recurso con ese ID" })
                                else {

                                    AdminResource.findByIdAndDelete({ _id: req.params.id }).exec().then((success: any) => {
                                        UserResourceModel.deleteMany({ id_resource_admin: req.params.id }).exec();
                                        res.status(201).json({ ok: true, msg: "El recurso seleccionado ha sido eliminado" })
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}