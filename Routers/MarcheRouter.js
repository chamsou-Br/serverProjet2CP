const express = require('express');
const MarcheRouter = express.Router();
const bodyparser = require('body-parser');
const MarcheModal = require("../Modals/marche");
const UserModal = require('../Modals/User');

MarcheRouter.use(bodyparser.json());
const dateNow = new Date().getUTCDate().toString() + '/' + (new Date().getUTCMonth() + 1 ).toString() + '/' + new Date().getUTCFullYear().toString()

MarcheRouter.post('/test' , (req , res) => {
    res.send(req.body);
})

//get dossier 
MarcheRouter.get('/getdossier' , async (req , res) => {
    try {
     const dossiers = await MarcheModal.find({});
     res.send(dossiers);
    }catch(e) {
        console.log(e.message);
    }
})

// new DOcument
MarcheRouter.post('/newDossiers' , async (req , res) => {

    console.log(req.body);
    try{
        const newDocument = await MarcheModal.create({
            num_dossier : req.body.num_dossier ,
            num_ancien_dossier : req.body.num_ancien_dossier ,
            observations_gnrl : req.body.observations_gnrl,
            marche :{ 
                        type_prestation: req.body.type_prestation,
                        objet: req.body.objet,
                        date_lancement: req.body.date_lancement,
                        data_ouverture: req.body.data_ouverture,
                        observation: req.body.observation,
                        fournisseur: req.body.fournisseur,
                        data_transm: req.body.data_transm,
                        decision: req.body.decision,
                        num_convention: req.body.num_convention,
                        respo_dossier: req.body.respo_dossier,
                        duree_trait: req.body.duree_trait
                    }
        })
        const users_ = await UserModal.find();
        users_.map(async(user) => {
            const notif = {
                typeof : "complete" ,
                date : dateNow ,
                notif : "service marche a créé nouveau dossier",
                idDossier : newDocument._id

            } 
            user.notification = [notif,...user.notification]
            user.isnotif = true;
            await user.save();
        })
        res.send(newDocument);

    }catch(e) {

        console.log(e.message);

    }})

//  modification marche

MarcheRouter.post('/marche/:id' , async (req , res) => {
    
    const doc = await MarcheModal.findById(req.params.id);
    if(req.body.type === 0 || req.body.type === 1 ) {
        console.log( doc.marche.type_prestation);
        try{
            doc.marche = { 
                type_prestation: req.body.type_prestation ? req.body.type_prestation : doc.marche.type_prestation,
                objet: req.body.objet ? req.body.objet : doc.marche.objet,
                date_lancement: req.body.date_lancement ? req.body.date_lancement : doc.marche.date_lancement,
                data_ouverture: req.body.data_ouverture ? req.body.data_ouverture : doc.marche.data_ouverture,
                observation: req.body.observation ? req.body.observation : doc.marche.observation,
                fournisseur: req.body.fournisseur ? req.body.fournisseur : doc.marche.fournisseur,
                data_transm: req.body.data_transm ? req.body.data_transm : doc.marche.data_transm,
                decision: req.body.decision ? req.body.decision : doc.marche.decision,
                num_convention: req.body.num_convention ? req.body.num_convention : doc.marche.num_convention,
                respo_dossier: req.body.respo_dossier ? req.body.respo_dossier : doc.marche.respo_dossier,
                duree_trait: req.body.duree_trait ? req.body.duree_trait : doc.marche.duree_trait,
                encore : doc.marche.encore,
                finish : doc.marche.finish
            }
             if (req.body.type === 1) {
                doc.commande.encore = true ;
                doc.marche.finish = true;
                doc.commande.date_reception = dateNow ;
                const users_marche = await UserModal.find({service : 'commande'});
                const ordon =   await UserModal.find({service : "ordonnateur"});

                ordon.map(async(user) => {
                    const notif = {
                        typeof : "complete" ,
                        date : dateNow ,
                        notif : "service marche a completé un dossier",
                        idDossier : req.body.idDossier

                    } 
                    user.notification = [notif,...user.notification]
                    user.isnotif = true;
                    await user.save();
                })
                users_marche.map(async(user) => {
                    const notif = {
                        typeof : "complete" ,
                        date : dateNow ,
                        notif : "service marche a completé un dossier",
                        idDossier : req.body.idDossier

                    } 
                    user.notification = [notif,...user.notification]
                    user.isnotif = true;
                    await user.save();
                })

             }
             await  doc.save();
             res.send(doc);
    
        }catch(e) {
            console.log(e.message);
        }
    }else if(req.body.type === 2) {
        const users_marche = await UserModal.find({});
        users_marche.map(async (user) => {
            const notif = {
                typeof : "cancel" ,
                date : dateNow ,
                notif : "un dossier est blocké par le service marche",
                idDossier : req.body.idDossier

            } 
            user.notification = [notif,...user.notification]
            user.isnotif = true;
            await user.save();
        })
        doc.block = true ;
        await  doc.save();
         res.send(doc);
    }
 
  
})

// modification commandes 

MarcheRouter.post('/commande/:id',async (req, res) => {
    const doc = await MarcheModal.findById(req.params.id);

    try {
        if (req.body.type == 0 || req.body.type == 1 ) {
            doc.commande = {
                date_reception: req.body.date_reception  ? req.body.date_reception :  doc.commande.date_reception ,
                respo_dossier: req.body.respo_dossier  ? req.body.respo_dossier :  doc.commande.respo_dossier,
                decision: req.body.decision ? req.body.decision :  doc.commande.decision,
                observation: req.body.observation ? req.body.observation :  doc.commande.observation,
                num_fact_proforma: req.body.num_fact_proforma ? req.body.num_fact_proforma :  doc.commande.num_fact_proforma,
                date_fact_proforma: req.body.date_fact_proforma ? req.body.date_fact_proforma :  doc.commande.date_fact_proforma,
                montant: req.body.montant ? req.body.montant :  doc.commande.montant,
                num_bon_commande: req.body.num_bon_commande ? req.body.num_bon_commande :  doc.commande.num_bon_commande,
                date_bon_commande: req.body.date_bon_commande ? req.body.date_bon_commande :  doc.commande.date_bon_commande,
                date_reception_prest: req.body.date_reception_prest ? req.body.date_reception_prest :  doc.commande.date_reception_prest,
                num_fact_definitive: req.body.num_fact_definitive ? req.body.num_fact_definitive :  doc.commande.num_fact_definitive,
                num_bon_reception: req.body.num_bon_reception ? req.body.num_bon_reception :  doc.commande.num_bon_reception,
                date_envoi:req.body.date_envoi ? req.body.date_envoi :  doc.commande.date_envoi,
                duree_trait:req.body.duree_trait ? req.body.duree_trait :  doc.commande.duree_trait,
                encore : doc.commande.encore,
                finish : doc.commande.finish
            }
            if (req.body.type === 1 ) {
                doc.budget.encore = true ;
                doc.commande.finish = true;
                doc.budget.date_reception = dateNow ;
                const users_commande = await UserModal.find({service : 'budget'});
                const ordon =   await UserModal.find({service : "ordonnateur"});

                users_commande.map(async(user) => {
                    const notif = {
                        typeof : "complete" ,
                        date : dateNow ,
                        notif : "le service commande a completé un dossier",
                        idDossier : req.body.idDossier

                    } 
                    user.notification = [notif,...user.notification]
                    user.isnotif = true;
                    await user.save();
                })
                ordon.map(async(user) => {
                    const notif = await {
                        typeof : "complete" ,
                        date : dateNow ,
                        notif : "service marche a completé un dossier",
                        idDossier : req.body.idDossier

                    } 
                    user.notification = [notif,...user.notification];
                     user.isnotif = true;
                    await user.save();
                })
            }
            await doc.save();
            res.send(doc)
        }else if (req.body.type === 2) {
            const users_commande = await UserModal.find({});
            users_commande.map(async (user) => {
                const notif = {
                    typeof : "cancel" ,
                    date : dateNow ,
                    notif : "un dossier est blocké par le service commande",
                    idDossier : req.body.idDossier
    
                } 
                user.notification = [notif,...user.notification]
                user.isnotif = true;
                await user.save();
            })
            doc.block = true ;
            await  doc.save();
             res.send(doc);
        }
    }catch(e) {
        console.log(e.message);
    }
})

// budget modification

MarcheRouter.post('/budget/:id',async (req, res) => {
    
    const doc = await MarcheModal.findById(req.params.id);

    try {
        if (req.body.type === 0 || req.body.type === 1 ) {
            doc.budget = {
                date_reception: req.body.date_reception ? req.body.date_reception : doc.budget.date_reception,
                respo_dossier:  req.body.respo_dossier ? req.body.respo_dossier : doc.budget.respo_dossier,
                observations:  req.body.observations ? req.body.observations : doc.budget.observations,
                date_engag_cf:  req.body.date_engag_cf ? req.body.date_engag_cf : doc.budget.date_engag_cf,
                motifs_rejet:  req.body.motifs_rejet ? req.body.motifs_rejet : doc.budget.motifs_rejet,
                date_visa_rejet:  req.body.date_visa_rejet ? req.body.date_visa_rejet : doc.budget.date_visa_rejet,
                date_mandatement:  req.body.date_mandatement ? req.body.date_mandatement : doc.budget.date_mandatement,
                date_transm:  req.body.date_transm ? req.body.date_transm : doc.budget.date_transm,
                duree_trait:  req.body.duree_trait ? req.body.duree_trait : doc.budget.duree_trait ,
                encore : doc.budget.encore,
                finish : doc.budget.finish
            }
            if (req.body.type === 1 ) {
                console.log('yes');
                doc.comptable.encore = true ;
                doc.budget.finish = true;
                doc.comptable.date_reception = dateNow ;
                const users_budget = await UserModal.find({service : 'compatable'});
                const ordon =   await UserModal.find({service : "ordonnateur"});
                ordon.map(async(user) => {
                    const notif = {
                        typeof : "complete" ,
                        date : dateNow ,
                        notif : "service marche a completé un dossier",
                        idDossier : req.body.idDossier

                    } 
                    user.notification = [notif,...user.notification]
                    user.isnotif = true;
                    await user.save();
                })
                users_budget.map(async(user) => {
                    const notif = {
                        typeof : "complete" ,
                        date : dateNow ,
                        notif : "le service budget a completé un dossier",
                        idDossier : req.body.idDossier

                    } 
                    user.notification = [notif,...user.notification]
                    user.isnotif = true;
                    await user.save();
                })
            }
                await doc.save();
                res.send(doc)  
        }else {if (req.body.type === 2) {
            const users_budget = await UserModal.find({});
            users_budget.map(async (user) => {
                const notif = {
                    typeof : "cancel" ,
                    date : dateNow ,
                    notif : "le dossier est blocké par le service budget",
                    idDossier : req.body.idDossier
    
                } 
                user.notification = [notif,...user.notification]
                user.isnotif = true;
                await user.save();
            })
            doc.block = true ;
            await  doc.save();
             res.send(doc);
        }}
          
    }catch(e) {
        console.log(e.message);
    }
})


// comptable modification 

MarcheRouter.post('/comptable/:id',async (req, res) => {
    const doc = await MarcheModal.findById(req.params.id);

    try {
        if (req.body.type === 0 || req.body.type === 1) {
            doc.comptable = {
                date_reception: req.body.date_reception ? req.body.date_reception : doc.comptable.date_reception ,
                respo_dossier:  req.body.respo_dossier ? req.body.respo_dossier : doc.comptable.respo_dossier,
                decision:  req.body.decision ? req.body.decision : doc.comptable.decision,
                piece_cmpleter:  req.body.piece_cmpleter ? req.body.piece_cmpleter : doc.comptable.piece_cmpleter,
                date_cmplement:  req.body.date_cmplement ? req.body.date_cmplement : doc.comptable.date_cmplement,
                date_paiement:  req.body.date_paiement ? req.body.date_paiement : doc.comptable.date_paiement,
                observations:  req.body.observations ? req.body.observations : doc.comptable.observations,
                duree_trait:  req.body.duree_trait ? req.body.duree_trait : doc.comptable.duree_trait,
                encore : doc.comptable.encore,
                finish : doc.comptable.finish
            }
            if (req.body.type === 1) {
                doc.comptable.date_cmplement = dateNow;
                doc.comptable.encore = false ;
                const users_compa = await UserModal.find({});
                users_compa.map(async(user) => {
                    const notif = {
                        typeof : "complete" ,
                        date : dateNow ,
                        notif : "le service compatibilité a completé un dossier",
                        idDossier : req.body.idDossier

                    } 
                    user.notification = [notif,...user.notification]
                    user.isnotif = true;
                    await user.save();
                })
                doc.finish = true ;
                doc.comptable.finish = true;
            }
            await doc.save();
            res.send(doc)
        }else if (req.body.type === 2) {
            const users_compa = await UserModal.find({});
            users_compa.map(async (user) => {
                const notif = {
                    typeof : "cancel" ,
                    date : dateNow ,
                    notif : "un dossier est blocké par le service compatibilité",
                    idDossier : req.body.idDossier
    
                } 
                user.notification = [notif,...user.notification]
                user.isnotif = true;
                await user.save();
            })
            doc.block = true ;
            await  doc.save();
             res.send(doc);
        }
            
    }catch(e) {
        console.log(e.message);
    }
})



module.exports = MarcheRouter;


