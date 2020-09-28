const { age, date } =  require('../lib/utils')
const Member = require('../models/Member')

module.exports = {
    index(req, res){
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(members) {
                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                }
                return res.render("members/index", { members, pagination, filter })
            }
        }
        
        Member.paginante(params)
    },
    create(req, res){

        Member.instructorsSelectOptions(function(options) {
            return res.render('members/create', { instructorOptions: options })
        })

    },
    post(req, res){
        // Checking if the fields are empty
        const keys = Object.keys(req.body)

        for(key of keys) {
            // req.body.key == ""
            if (req.body[key] == "" ) {
                return res.send('Please fill out all required fields')
            }
        }

        Member.create(req.body, function(member) {
            return res.redirect(`/members/${member.id}`)
        })
        
    },
    show(req, res){
       Member.find(req.params.id, function(member) {
           if(!member) return res.send("Member not found")

            member.birth = date(member.birth).birthDay

            return res.render("members/show", { member })
       })
    },
    edit(req, res){
        Member.find(req.params.id, function(member) {
            if(!member) return res.send("Instrutor not found")
 
             member.birth = date(member.birth).iso

             Member.instructorsSelectOptions(function(options) {
                return res.render('members/edit', { member, instructorOptions: options })
            })
        })
    },
    put(req, res){
        const keys = Object.keys(req.body)

        for(key of keys) {
            // req.body.key == ""
            if (req.body[key] == "" ) {
                return res.send('Please fill out all required fields')
            }
        }

        Member.update(req.body, function() {
            return res.redirect(`/members/${req.body.id}`)
        })
    },
    delete(req, res){
        Member.delete(req.body.id, function() {
            return res.redirect(`/members`)
        })
    }
}