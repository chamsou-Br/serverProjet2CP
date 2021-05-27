const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dossierSchema = new Schema({
    num_dossier: {
        type: String,
        required: true
    },
    num_ancien_dossier: {
        type: String,
    },
    observations_gnrl: {
        type: String,
    },
    block : {
        type : Boolean ,
        default : false
    },
    finish : {
        type : Boolean , 
        default : false ,
    },
    marche: {
        encore : {
            type : Boolean,
            default : true,
        },
        finish : {
            type : Boolean,
            default : false
        },
        type_prestation: {
            type: String,
        },
        objet: {
            type: String,
        },
        date_lancement: {
            type: String,
        },
        data_ouverture: {
            type: String,
        },
        observation: {
            type: String,
        },
        fournisseur: {
            type: String,
        },
        data_transm: {
            type: String,
        },
        decision: {
            type: String,
        },
        num_convention: {
            type: String,
        },
        respo_dossier: {
            type: String,
        },
        duree_trait: {
            type: String,
        }
    },
    commande: {
        encore : {
            type : Boolean,
            default : false,
        },
        finish : {
            type : Boolean,
            default : false
        },
        date_reception: {
            type: String,
        },
        respo_dossier: {
            type: String,
        },
        decision: {
            type: String,
        },
        
        observation: {
            type: String,
        },
        num_fact_proforma: {
            type: String,
        },
        date_fact_proforma: {
            type: String,
        },
        montant: {
            type: String,
        },
        num_bon_commande: {
            type: String,
        },
        date_bon_commande: {
            type: String,
        },
        date_reception_prest: {
            type: String,
        },
        num_fact_definitive: {
            type: String,
        },
        num_bon_reception: {
            type: String,
        },
        date_envoi:{
            type: String,
        },
        duree_trait:{
            type: String,
        },
    },
    budget: {
        encore : {
            type : Boolean,
            default : false,
        },
        finish : {
            type : Boolean,
            default : false
        },
        date_reception: {
            type: String,
        },
        respo_dossier: {
            type: String,
        },
        observations: {
            type: String,
        },
        date_engag_cf: {
            type: String,
        },
        motifs_rejet: {
            type: String,
        },
        date_visa_rejet: {
            type: String,
        },
        date_mandatement: {
            type: String,
        },
        date_transm: {
            type: String,
        },
        duree_trait: {
            type: String,
        }
    },
    comptable: {
        encore : {
            type : Boolean,
            default : false,
        },
        finish : {
            type : Boolean,
            default : false
        },
        date_reception: {
            type: String,
        },
        respo_dossier: {
            type: String,
        },
        decision: {
            type: String,
        },
        piece_cmpleter: {
            type: String,
        },
        date_cmplement: {
            type: String,
        },
        date_paiement: {
            type: String,
        },
        observations: {
            type: String,
        },
        duree_trait: {
            type: String,
        }
    }
})

const Dossier = mongoose.model('Dossier', dossierSchema);
module.exports = Dossier;