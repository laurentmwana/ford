var nodes =  new vis.DataSet()
var edges =  new vis.DataSet()
var nodeCreate = []
var nodeCheck =  []
var nodeDelete = []
var nodeUpdate = []
var edgeArray = []


// champs id du node (sommet)
const nodeId = document.querySelector('#node-id')
// champs label du node (nom du sommet)
const nodeLabel = document.querySelector('#node-label')

// champs pour déterminer si le sommet est la racine 
const nodeSource = document.querySelector('#source')


// champs id du edge 

const edgeId = document.querySelector('#edge-id')
// champs id du edge (sommet)
const from = document.querySelector('#edge-from')
// champs label du edge (nom du sommet)
const to = document.querySelector('#edge-to')

// checkbox pour déterminer si le sommet est la racine 
const valueAssoc = document.querySelector('#value-assoc')


// function ajouter node
const addNode = function () {

  const N = document.querySelector('#N')
  const node = parseInt(N.value, 10)

  if (N == "") {
    alert("Le champs est obligatoire")
  } else {

    try {
      
      nodes = new vis.DataSet()
      edges = new vis.DataSet()
      nodeCreate = []
      nodeCheck =  []
      nodeDelete = []
      nodeUpdate = []
      edgeArray = []
      

      for (let key = 1; key <= node; key++) {
        let name = "S" + key
        nodes.add({
          id: key,
          label: name,
          source: false
        })
        nodeCreate[key] = name
        nodeCheck.push(name)
      }

      change(nodes, edges)


    } catch (error) {
      alert(error)
    }

  }
}

// function update Node
const updateNode = function () {

  const id = nodeId.value
  const label = nodeLabel.value

  if (id == "" || label === "") {
    alert("Les deux champs sont obligatoire")
  } 
  
  else {
    if (nodeCreate[id] !== undefined && nodeCreate.length != 0) {

      let value =  nodeCreate[id]
      let index = nodeCheck.indexOf(value)

      if (index >= 0 && !nodeCheck.includes(label)) {
        nodeCheck[index] = label
        nodeCreate[id] = nodeCheck[index]
        nodes.update({id, label});
        change(nodes, edges)
      }

      else {
        alert("Il y a déjà un sommet qui porte ce nom ")
      }
    }
  }
}


// supprimer un node
const removeNode = function () {
  const id = nodeId.value

  if (id == "") {
    alert("Le champs id est obligatoire")
  } else {

    // on vérifie l'id existe dans le tableau des nodes
    if (nodeCreate[id] != undefined && !nodeDelete.includes(id)) {
      // confirmation de la supprimr du sommet
      let confirmation = confirm("Voulez-vous supprimer le sommet #" + id)

      // TRUE
      if (confirmation) {
        // on supprime le sommet
        try {
          
          nodes.remove({id});
          nodeDelete.push(id)
          change(nodes, edges)
        }
        catch (err) {
          alert(err);
        }
      }
    }
  }


}

//  déterminer la racine du réseau 
const Racine = function () {
  let id = document.querySelector("#id-racine").value
  id = id.trim()


  if (id == "") {
    alert("le champs est obligatoire")
  }

  else {
    if (nodeCreate[id] !== undefined) {

      for (let k = 0; k < nodes.get().length; k++) {
        const element = nodes.get()[k];
        // on intialiser tous les sommets à false
        nodes.update({id: element.id, source: false, color: null});
        
      }
      // on définit la nouvelle racine
      nodes.update({id: id, source: true, color: '#d1d5d8'});

      // on met à jour nos données
      change(nodes, edges)
    }
  }
}


/**
 * Permet d'ajouter une relation (un arc réliant deux ou plusieurs sommets)
 */
const addEdge = function () {

  // on récupère les valeurs envoyées
  const nodeX = from.value
  const nodeY = to.value
  const value = valueAssoc.value
  const id = edgeId.value


  // on vérifie si les valeurs sont vide (chaine vide)
  if (
    nodeX === "" || nodeY === "" || value === "" || id === ""
  ) {
    // TRUE
    // on affiche une message d'erreurs
    alert("Vous devez remplir tous les champs (:")
  } else {
    let errors = []
    
    if (isNaN(nodeX)) {
      errors.push("L'id du sommet X doit être un entier ")
    }

    if (isNaN(nodeY)) {
      errors.push("L'id du sommet Y doit être un entier ")
    }

    if (isNaN(value)) {
      errors.push("La valeur associée doit être un réel ")
    }


    // on a pas d'erreurs 
    if (errors.length == 0) {
      let okFrom = false
      let okTo = false
      let alias = []
      let racine = null

      for (let index = 0; index < nodes.get().length; index++) {
        const element = nodes.get()[index];

        if (element.source === true) {
          racine = element.id
          break
        }
      }

      if (racine == null) {
        alert(" Vous devez définir la racine ")
      }

      else {

        console.log(nodeY, racine);
        if (racine === nodeY) {
          
          alert(" On est peut pas retourner à la racine ")
        }

        else {
            
          if (nodes.get().length > 1) {

            // on vérifie les id s'ils existent
            for (let index = 0; index < nodes.get().length; index++) {
              const element = nodes.get()[index]


              if (element.source === true) {
                racine = element.id
              }

              if (element.id == nodeX) {
                okFrom = true
                alias.push(element.label)
              }

            
              if (element.id == nodeY) {
                okTo = true
                alias.push(element.label)
              }

              if (okFrom && okTo) {
                alias.sort()
                alias = alias.join('-')
                break
              }
            }

            if (okFrom && okTo) {

              if (nodeX == nodeY) {
                alert("On est peut pas avoir une boucle dans ce graphe")
              }

              else {

                if (edges.get().length != 0) {
                  let exist = false
                  for (let index = 0; index < edges.get().length; index++) {
                    const element = edges.get()[index];
          
                    if (element.id == id) {
                      exist = true
                      break
                    }
                    
                  }

                  if (!exist) {
                    edges.add({
                      id: id,
                      from: nodeX,
                      to: nodeY,
                      label: value,
                      arrows: 'to',
                    })
                  } 
                  
                  else {
                    alert("C'est arc est déjà utilisé ")
                  }           
                }

                else {
                  edges.add({
                    id: id,
                    from: nodeX,
                    to: nodeY,
                    label: value,
                    arrows: 'to',
                  })
                }

                change(nodes, edges)

              }
            }

            else {

              if (!okFrom) {
                alert("Le sommet #" + nodeX + " n'existe pas")
              }

              if (!okTo) {
                alert("Le sommet #" + nodeY + " n'existe pas")
              }
            }
          }
        }
      }
    } 
    // on a des erreurs, on l'affiche
    else {  alert(errors.join("\n"))  }
  }



}


/**
 * 
 * @param {DataSet} nodes 
 * @param {DataSet} edges 
 * @returns 
 */
function change (nodes, edges) {
  document.querySelector("#nodes").innerHTML = toJSON(nodes.get())
  document.querySelector("#edges").innerHTML = toJSON(edges.get())
  
  var container = document.querySelector('#view-graphe');
  return new vis.Network(container, {
    nodes:nodes,
    edges:edges
  }, {});
}

/**
 * 
 * @param {Object} obj 
 * @returns 
 */
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}
