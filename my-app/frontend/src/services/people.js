import axios from 'axios'
const baseUrl = import.meta.env.VITE_BACKEND_URL || 'api/notes'
console.log(`baseurl: ${baseUrl}`)

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll: getAll,
    create: create,
    update: update,
    del: del
}
