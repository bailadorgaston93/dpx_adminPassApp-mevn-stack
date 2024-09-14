import User from "../Model/User.model"
import bcrypt from "bcrypt";

import { varsConfig } from "../../Helpers/varsConfig";
import { generateTokenUser } from "../../Helpers/generateHash";
import { transporterSendEmail } from "../../Helpers/nMailer"

export const registerUser = async (req: any, res: any) => {

    const { name, lastname, email, password, confirm_password, birth } = req.body;

    const DATA_save: any = { email: email.toLowerCase(), password: password };

    let arr_err: string[] = [];
    for (let c in req.body) {
        if (req.body[c].trim() === "") arr_err.push(`El campo ${c} es requerido`);
    }

    const d1 = new Date();
    const d2 = new Date();
    const d3 = new Date(birth).getFullYear()
    const operation_year = d3 - d2.getFullYear()
    const date_MAX_limit = d1.getFullYear() + 50;
    const date_MIN_limit = d2.getFullYear() - 50;
    const REGEX_PASS = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,24}$/;

    if (!(d3 <= date_MAX_limit)) arr_err.push(`El año ingresado es muy elevado, intenta con uno igual o inferior al año ${date_MAX_limit}`)
    else if (!(d3 >= date_MIN_limit)) arr_err.push(`El año ingresado es muy bajo, intenta con uno igual o mayor al año ${date_MIN_limit}`)
    else if (Math.abs(operation_year) <= 15) arr_err.push("Eres menor de edad, no podés registrarte")

    if (password !== confirm_password) arr_err.push("Las contraseñas ingresadas deben ser iguales")
    if (!REGEX_PASS.test(password)) arr_err.push("La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, una mayúscula y un símbolo")

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {

        DATA_save.isAdmin = false;
        DATA_save.name = name;
        DATA_save.lastname = lastname;
        DATA_save.birth = birth;
        DATA_save.userActive = false;
        DATA_save.userIsActiveByAdmin = true;
        const TOKEN_gen = generateTokenUser(DATA_save)

        DATA_save.token_confirm_account = TOKEN_gen;

        await User.findOne({ email: email }).exec().then((data: any) => {
            if (data) res.status(404).json({ ok: false, msg: "El E-mail ingresado ya se encuentra almacenado" })
            else {
                transporterSendEmail(DATA_save.email, `Hola ${name} ${lastname} por favor, confirma tu cuenta`, {
                    name: DATA_save.name,
                    lastname: DATA_save.lastname,
                    uriToken: `${varsConfig.HOST_FRONTEND}/confirm/${TOKEN_gen}`
                });

                bcrypt.hash(DATA_save.password, 10, async function (err, hash) {
                    DATA_save.password = hash;
                    const user = new User(DATA_save);
                    await user.save();
                    res.status(201).json({
                        ok: true,
                        msg: "Se ha registrado un nuevo usuario"
                    });
                });
            }
        });
    }
}

export const confirmAccount = async (req: any, res: any) => {
    await User.findOne({ token_confirm_account: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "El token ingresado no se encuentra disponible o ya el usuario se encuentra activado" })
        else {
            if (!data.userActive) {
                User.findOneAndUpdate({ token_confirm_account: req.params.id }, {
                    token_confirm_account: "", userActive: true
                }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Tu cuenta ha sido activada, ahora podrás acceder" }));
            } else res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada" });
        }
    });
}

export const loginUser = async (req: any, res: any) => {
    const { email, password } = req.body;

    let arr_err: string[] = [];

    if (email.trim() === "" || password.trim() === "") arr_err.push(`Todos los campos son requeridos`);

    if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
    else {
        await User.findOne({ email: email }).exec().then((data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "El E-mail ingresado no se encuentra registrado" })
            else {
                if (data.userIsActiveByAdmin) {
                    if (data.userActive) {
                        bcrypt.compare(password, data.password).then((result) => {
                            if (!result) {
                                res.status(404).json({
                                    ok: true,
                                    msg: "Los datos ingresados son inválidos. Verifique y vuelva a intentar"
                                });
                            } else {
                                const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(data)));
                                let new_data: any = {
                                    token_auth: TOKEN_gen,
                                    name: data.name,
                                    lastname: data.name,
                                    email: data.email,
                                    birth: data.birth,
                                    isAdmin: data.isAdmin,
                                    token_confirm_account: data.token_confirm_account,
                                    userActive: data.userActive,
                                    userIsActiveByAdmin: data.userIsActiveByAdmin
                                };
                                res.status(201).json({
                                    ok: true,
                                    data: new_data,
                                    msg: "Usuario ingresado exitosamente"
                                });
                            }
                        });
                    }
                    else res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada" });
                } else res.status(404).json({ ok: false, msg: "Esta cuenta ha sido deshabilitada por el Admin" });
            }
        });
    }
}

export const recoveryUser = async (req: any, res: any) => {

    const { email } = req.body;

    let arr_err: string[] = [];

    if (email.trim() === "") arr_err.push(`El campo E-mail es requerido`);

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {

        await User.findOne({ email: email }).exec().then((data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "El E-mail ingresado no se encuentra registrado" })
            else {
                const new_data = {
                    ...JSON.parse(JSON.stringify(data)),
                    token_confirm_account: ""
                };

                const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(new_data)));

                User.findOneAndUpdate({ email: email }, { token_confirm_account: TOKEN_gen }).exec().then((success: any) => {
                    transporterSendEmail(data.email, `Hola ${data.name} ${data.lastname} por favor, ${!data.userActive ? "confirma tu cuenta" : "cambia tu contraseña"}`, {
                        name: data.name,
                        lastname: data.lastname,
                        uriToken: `${varsConfig.HOST_FRONTEND}/${!data.userActive ? "confirm" : "reset"}/${TOKEN_gen}`
                    });
                });

                if (!data.userActive) res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada. Se te ha enviado un mensaje a tu correo para que puedas activar tu cuenta" })
                else res.status(201).json({ ok: true, msg: "Se te ha enviado un mensaje a tu correo para que puedas cambiar tu contraseña" });
            }
        });
    }
}

export const resetPasswordUser = async (req: any, res: any) => {

    const { password, confirm_password } = req.body;

    let arr_err: string[] = [];

    const REGEX_PASS = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,24}$/;

    if (password.trim() === "") arr_err.push(`El campo 'contraseña' es requerido`);

    if (password !== confirm_password) arr_err.push(`Las contraseñas ingresadas deben ser iguales`);
    if (!REGEX_PASS.test(password)) arr_err.push("La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, una mayúscula y un símbolo")

    if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
    else {
        await User.findOne({ token_confirm_account: req.params.id }).exec().then((data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "El usuario ingresado no se encuentra registrado" })
            else {
                if (data.userActive) {
                    bcrypt.hash(password, 10, async function (err, hash) {
                        User.findOneAndUpdate({ token_confirm_account: req.params.id }, { token_confirm_account: "", password: hash }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "La contraseña fue cambiada con éxito" }));
                    });
                }
                else res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada" });
            }
        });
    }
}