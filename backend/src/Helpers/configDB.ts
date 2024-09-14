import mongoose from "mongoose";
import Admin_inputResource from "../CORE/Model/AdminResource.model";
import { varsConfig } from "./varsConfig";

export const configDB = async () => {
    try {
        await mongoose.connect(varsConfig.ADRESS_MONGO);

        console.log("DB is connected ;)");

        Admin_inputResource.findOne({ name_resource: "Tipo de contraseña" || "Tipo de tarjeta" || "Nota" }).exec().then((dat: any) => {
            if (!dat) {
                Admin_inputResource.insertMany([
                    {
                        name_resource: "Tipo de contraseña",
                        name_type_encrypt: "JWT",
                        fields: [
                            {
                                label_input: "Nombre del recurso",
                                name_input: "nombre_del_recurso",
                                type_input: "text"
                            },
                            {
                                label_input: "Usuario",
                                name_input: "usuario",
                                type_input: "text"
                            },
                            {
                                label_input: "Contraseña",
                                name_input: "contrasenia",
                                type_input: "password"
                            }
                        ]
                    },
                    {
                        name_resource: "Tipo de tarjeta",
                        name_type_encrypt: "JWT",
                        fields: [
                            {
                                label_input: "Nombre del recurso",
                                name_input: "nombre_del_recurso",
                                type_input: "text",
                            },
                            {
                                label_input: "Nombre de la tarjeta",
                                name_input: "nombre_tarjeta",
                                type_input: "text",
                            },
                            {
                                label_input: "Nro de la tarjeta",
                                name_input: "nrodetarjeta",
                                type_input: "password"
                            },
                            {
                                label_input: "Mes de expiración",
                                name_input: "mesdeexpiracion",
                                type_input: "text"
                            },
                            {
                                label_input: "Año de expiración",
                                name_input: "aniodeexpiracion",
                                type_input: "text",
                            },
                            {
                                label_input: "Código de seguridad",
                                name_input: "codigodeseguridad",
                                type_input: "password"
                            }
                        ]
                    },
                    {
                        name_resource: "Nota",
                        name_type_encrypt: "JWT",
                        fields: [
                            {
                                label_input: "Nombre del recurso",
                                name_input: "nombre_del_recurso",
                                type_input: "text"
                            },
                            {
                                label_input: "Descripción",
                                name_input: "descripcion",
                                type_input: "text"
                            }
                        ]
                    }
                ]).then(function () {
                    console.log("Data inserted")  // Success 
                }).catch(function (error) {
                    console.log(error) // Failure 
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

