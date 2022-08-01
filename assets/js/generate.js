

var nodeArray = []
var edgeArray = []

var unique = 1


const childAdd = document.querySelector("#child-add")
const childRacine = document.querySelector("#child-racine")
const childArc = document.querySelector("#child-arc")


console.log(childRacine);

/**
 * Ajouter les sommets
 */
function addNode () {
    
    // ajouter un sommet
    const createNode = document.querySelector("#create-node").value


    if (createNode === "") {
        alert('Le champs taille du graphe est obligatoire ')
    } else {
        if (isNaN(createNode)) {
            alert(createNode + " n'est pas un nombre ");
        } else {

            let names = ['S', 'K', 'A', 'route']
            let key = Math.round(Math.random() * 3)
            let label = names[key]
            nodeArray = []
            edgeArray = []
            unique = 1
            
            for (let index = 1; index <= parseInt(createNode); index++) {

                nodeArray.push({
                    id : label + index,
                    label: label + index,
                    source: false,
                    relate: false
                })
            }

            document.querySelector('#name-node').innerText =  label

      
            childAdd.classList.remove('child-on')
            childAdd.classList.add('child-off')
            childRacine.classList.remove('child-off')
            childRacine.classList.add('child-on')

            change(nodeArray, edgeArray)
            
        }
    }
}

/**
 * Définir la racine 
 */
function Racine () {

    const racine = document.querySelector("#racine").value

    if (racine == "") { alert("le champs est obligatoire") } 
    else {
        let check = false
        for (let index = 0; index < nodeArray.length; index++) {
            const node = nodeArray[index];
            if (node.source === true && node.id != racine) {
                node.source = false
                node.color =  null
            } if (node.id === racine) {
                check = true
                node.source = true
                node.color = '#d1d5d8'
            }
        } if (check) {
            alert("La racine est le sommet " + racine + " qui a la couleur grise")
            if (childArc.classList.contains('child-off')) {
                childArc.classList.remove('child-off')
                childArc.classList.add('child-on')
            }

        } else {
            alert("Les données ont été réinitialiser car le sommet " + racine + " n'existe pas ")
            if (childArc.classList.contains('child-on')) {
                childArc.classList.remove('child-on')
                childArc.classList.add('child-off')
            }
        }

        change(nodeArray, edgeArray)
    }
}

/**
 * Ajouter un edge
 */
function addEdge () {

    const to = document.querySelector('#to').value
    const from = document.querySelector('#from').value
    const value = document.querySelector('#value').value

    if (to === "" || from === "" || value ===  "") {
        alert("Tous les champs sont obligatoires ")
    } else {

        if (isNaN(value)) {
            alert("La valeur associée doit être un nombre ")
        } else {


            if (from === to) {
                alert(" Les boucles ne sont pas autoriées ")
                
            } else {
                let check = [] 

                check['to'] = false
                check['from'] = false
                check['noreturn'] = false
                check['relate'] = {from: undefined, to: undefined}
            
                for (let k = 0; k < nodeArray.length; k++) {
                    const node = nodeArray[k];

                    if (node.id === to && node.source === true) {
                        check['noreturn'] = true
                        break
                    } 
                    
                    if (node.id === to) {
                        check['to'] = true
                        check['relate'].from = k
                    } 
                    
                    if (node.id === from) {
                        check['from'] = true
                        check['relate'].to = k
                    }
                }

                if (check['noreturn']) {
                    alert('On est peut pas retourner à la racine')
                } else if (check['from'] === false) {
                    alert('Le sommet ' + from + ' n\'existe pas')
                } else if (check['to'] === false) {
                    alert('Le sommet ' + to + ' n\'existe pas')
                }  {

                    // on ajoute la nouvelle relation dans le tableau de données 
                   try {
                    edgeArray.push({
                        id: from + '-' + to + '-' + unique++,
                        from: from,
                        to: to,
                        label: value,
                        arrows: 'to',
                        size: parseInt(value)
                    })

                    nodeArray[check['relate'].from].relate = true
                    nodeArray[check['relate'].to].relate = true

                    change(nodeArray, edgeArray)

                   } catch (error) {
                    alert('cette relation existe')
                   }
                }
            }

            

        }


    }




}


/*******************    ALGORITHME DE BELLMAN-FORD AVEC LA METHODE DE PCC      ****************** */

/******* DEBUT *****/
function Ford () {
    

    //  on vérifie qu'il n'y a pas des sommets isolés (donc des sommets qui n'ont pas de relation avec d'autres sommets )
    let relate = true

    // on parcourt le tableau de sommet
    for (let index = 0; index < nodeArray.length; index++) {
        const node = nodeArray[index];

        // si un sommet n'est pas rélier
        // on met la variable relate (relation en anglais en false) pour dire qu'il y a un ou plusieurs sommets qui ne sont pas rélier
        if (node.relate === false) {
            relate = false
            // on sort de la boucle
            break
        }
    }

    // A la sortie on vérifie si la variable relate a changé des valeurs
    if (relate === false) {
        // on affiche un message d'erreurs
        alert('Les sommets isolés ne sont pas autorisés')
    } else {

        // tous les sommets sont réliés (donc tout est OK)

        // Initialisations (Etape 1)
        let poids = []
        let predecesseurs = []
        let modifier = []

        // on commence toujours à la racine
        let key = undefined
        let racine = undefined

        // tableau de successeurs
        let successeurs = []

        // on initialise les poids de tous les sommets par  + infini
        // la racine par 0
        // on parcourt le tableau des sommets
        for (let index = 0; index < nodeArray.length; index++) {
            const node = nodeArray[index];

            // le poids
            if (node.source === true) {
                poids[node.label] = 0

                if (index !== 0) {
                    racine = node
                    key = index
                }

            } else {
                poids[node.label] = Infinity
            }

            // on depart chaque sommet est le predecesseur de lui-même
            predecesseurs[node.label] =  node.label;

            // pas de traitement
            modifier[node.label] =  false;
        }

        // on fait en sorte que la racine soit toujours à la première itération
        if (key !== undefined && racine !== undefined) {
            nodeArray.splice(-1, key)
            nodeArray.unshift(racine)
        }

        // Itération courante (Etape 2)
        let i = 0
        while (i < nodeArray.length) {
            
            // le sommet courant
            const node = nodeArray[i]
            successeurs[node.label] = undefined

            // on cherche tous les successeurs de i courante
            for (let index = 0; index < edgeArray.length; index++) {
                const edge = edgeArray[index];

                // on le met dans le tableau de successeurs
                if (edge.from === node.id && node.id !== edge) {
                    if (successeurs[node.label] === undefined) {
                        successeurs[node.label] = []
                    }

                    successeurs[node.id].push(edge)
                } 
            }

            // on calcul du poids (Etape 3)
            // on verifie si i courante à des successeurs
            if (successeurs[node.label] !== undefined) {
                for (let k = 0; k < successeurs[node.label].length; k++) {
                    const successeur = successeurs[node.label][k];

                    // on compare la valeur i + la ponderation entre i et j(successeur) < au poids(j)
                    const valeur = (poids[node.label] + successeur.size) 
                    if (valeur < poids[successeur.to]) {
                        // VRAI
                        poids[successeur.to] = valeur
                        predecesseurs[successeur.to] = node.label
                        modifier[successeur.to] = true
                    } else {
                        modifier[successeur.to] = false
                    }
                }
            }

            i++

            // on vérifie qu'il n' y a pas des valeurs true (VRAI) (Etape 4)
            // s'il y a des valeurs TRUE on recommence à zéro en mettant la variable i à 0
            if (i === nodeArray.length) {
                for (const key in modifier) {
                    if (modifier[key] === true) {
                        i = 0
                        break
                    }
                }
            }  
        }

        // on affiche les resultats (Etape 5 FIN)
        let edgeSorting = []
        
        for (const key in predecesseurs) {
            if (key !== predecesseurs[key]) {

                edgeSorting.push({
                    from: predecesseurs[key],
                    to: key,
                    label: poids[key] + "",
                    arrows: 'to',
                    color: "#20cf30"
                })
            }
        }
        
        childRacine.classList.remove('child-on')
        childRacine.classList.add('child-off')

        
        childArc.classList.remove('child-on')
        childArc.classList.add('child-off')

        
        childAdd.classList.remove('child-off')
        childAdd.classList.add('child-on')

        changeResult(nodeArray, edgeSorting)
    }



}
/******* FIN *****/


/**
 * 
 * @param {DataSet} nodesArray 
 * @param {DataSet} edges 
 * @returns 
 */
 function change (nodesArray, edgesArray) {

    let nodes =  new vis.DataSet()
    let edges =  new vis.DataSet()

    nodes.add(nodesArray)
    edges.add(edgesArray)
    
    let container = document.querySelector('#view-graphe')
    return new vis.Network(container, {
      nodes:nodes,
      edges:edges
    }, {});
  }


 
  function changeResult (nodeSorting, edgeSorting) {

    let sortingNode =  new vis.DataSet()
    let sortingEdge =  new vis.DataSet()

    // on affiche le resultat dans une div
    const sorting = document.querySelector('#view-result')
    sorting.classList.remove('view-off')
    sorting.classList.add('view-on')

    sortingNode.add(nodeSorting)
    sortingEdge.add(edgeSorting)
    
    let container = document.querySelector('#view-result')
    return new vis.Network(container, {
      nodes:sortingNode,
      edges:sortingEdge
    }, {});
  }