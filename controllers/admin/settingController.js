
const Setting = require('../../models/generalSetting');
const {validationResult} = require("express-validator");


class SettingController {
    constructor() {
        this.path = 'admin/settings/';

        this.index = this.index.bind(this);
        this.store = this.store.bind(this);
    }
    async index(req, res, next) {
        const settings = await (new Setting()).findBy({}, [], [], );

       return res.render(this.path + 'index', { settings: settings, title: 'General Settings ' });
    }

    async store(req, res, next) {
        const result = validationResult(req);
        /**
         * We have va;datpom error
         */
        if (result.isEmpty() === false) {
            return res.status(422).send({ errors: result.array() });
        }

        const {title, keywords, author, subtitle } = req.body;
        const response = req.body;

        for (const [key, value] of Object.entries(response)) {
            await (new Setting()).update({'key': key}, {value}, {touchTimestamp: false})
        }

        return res.status(201).json({ title, keywords, author, subtitle  })
    }

}
module.exports = new SettingController();