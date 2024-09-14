import { transporterSendEmail } from "../../Helpers/nMailer";
import User from "../Model/User.model"
import bcrypt from "bcrypt";

export const getUsers = async (req: any, res: any) => {
    await User.find({ isAdmin: false }).select(["-password", "-__v", "-token_confirm_account"]).exec().then((data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No hay datos almacenados.", data: [] })
        else res.status(201).json({ ok: true, msg: "Los datos han sido obtenidos", data: data })
    });
}

export const desactivateUser = async (req: any, res: any) => {
    await User.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No hay datos almacenados." })
        else {

            let msg = "";

            if (data.userIsActiveByAdmin) {
                msg = "Tu cuenta ha sido desactivada por el Administrador del sitio";
            } else {
                msg = "Tu cuenta ha sido activada por el Administrador del sitio";
            }


            transporterSendEmail(data.email, `NOTIFICACIÓN`, {
                name: data.name,
                lastname: data.lastname,
                msg: msg
            });

            User.findOneAndUpdate({ _id: req.params.id }, {
                userIsActiveByAdmin: req.body.userIsActiveByAdmin
            }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "El estado del usuario ha sido cambiado" }));
        }
    });
}

export const editProfileUser = async (req: any, res: any) => {
    await User.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No hay datos almacenados." })
        else {
            const { email, password, confirm_password, } = req.body;
            let arr_err: string[] = [];

            for (let c in req.body) {
                if (req.body[c].trim() === "") arr_err.push(`El campo ${c} es requerido`);
            }

            const REGEX_PASS = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,24}$/;

            if (password !== confirm_password) arr_err.push(`Las contraseñas ingresadas deben ser iguales`);
            if (!REGEX_PASS.test(password)) arr_err.push("La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, una mayúscula y un símbolo")

            if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
            else {
                bcrypt.hash(password, 10, async function (err, hash) {
                    User.findOneAndUpdate({ _id: req.params.id }, {
                        password: hash, email: email.toLowerCase()
                    }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "La información ha sido actualizada exitosamente" }));
                });
            }
        }
    });
}