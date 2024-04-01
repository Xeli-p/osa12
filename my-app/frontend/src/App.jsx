import { useState, useEffect } from 'react'
import nameService from './services/people'
import './index.css'

const AddName = ({newName, phone, handleNewPersonChange, handlePhoneChange, addName}) => {
    return(
      <form onSubmit={addName}>
        <div>
          name: <input
            value={newName}
            onChange={handleNewPersonChange} />
        </div>
        <div>
          phone: <input
            value={phone}
            onChange={handlePhoneChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }


    const isError = message.toLowerCase().includes('error') || message.toLowerCase().includes('fail');
    console.log({message})
    return (
        <div className={isError ? 'error-red' : 'error'} >
            {message}
        </div>
    )
}

const Filter = ({filter, handler}) => {
  return(
      <form>
        <div>
          Filter shown with: <input
            onChange={handler}
            value={filter} />
        </div>
      </form>
  )
}

const Numbers = ({persons, filter, del}) => {
  console.log({persons})
  const filtered =
      persons.filter(person =>
          (person.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) || (String(person.phone).indexOf(filter) > -1)
      )

  return(
      filtered.map(person =>
          <p key={person.name}>
              {person.name} {person.phone} <button onClick={() => del(person.id, person.name)}>delete</button></p>
      )
  )
}


const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [phone, setNewPhone] = useState('')
    const [filter, setFilter] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const fetchAll = () => {
        nameService
            .getAll()
            .then(response => {
                console.log('promise fulfilled', response)
                setPersons(response.data);
            })
            .catch(error => {
                setErrorMessage('Failed to fetch data from the server');
            });
    }

    useEffect(() => {
        console.log('effect')
        fetchAll();
    },[])

    const updateData = () => {
        fetchAll();
    };

    const delName = (id, name) => {
        if(window.confirm(`sure you want to delete ${id} ${name}?`)){
            console.log(`id in delete : ${id}`)
            nameService
                .del(id)
                .then(response => {
                    console.log(response.data)
                    fetchAll()
                    setErrorMessage(
                        `Deleted ${name}`
                    )
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                })
                .catch(error => {
                    setErrorMessage(
                        `Information of ${name} has already been removed from the server or ${error}`
                    )
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                    console.log('fail')
                    console.log({id})
                })
        }
    }

    const addName = (event) => {
        event.preventDefault()
        console.log('button clicked', event.target)

        const nameObject = {
          name: newName,
          phone: phone
        }

        const found = (person) =>  person.name.toLowerCase() === newName.toLowerCase()

        console.log(persons.findIndex(found))

        console.log('nameObject :', nameObject)
        if(persons.findIndex(found) > -1){
          console.log(persons.findIndex(found))
            if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)){
                nameService
                    .update(persons[persons.findIndex(found)].id, nameObject)
                    .then(response => {
                        setPersons(persons.filter((person) => person.name.toLowerCase() !== newName.toLowerCase()).concat(response.data))
                        updateData();
                        setErrorMessage(
                            `Added ${nameObject.name}`
                        )
                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 5000)
                    })
                    .catch(error => {
                        console.log(error.response.data)
                        setErrorMessage(
                            error.message
                        )
                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 5000)
                    })
            }
        }

        if(persons.findIndex(found) < 0) {
            nameService
                .create(nameObject)
                .then(response => {
                    setPersons(persons.concat(response.data))
                    setNewName('')
                    setErrorMessage(
                        `Added ${nameObject.name}`
                    )
                    updateData();
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                })
                .catch(error => {
                    console.log(error)
                    setErrorMessage(
                        error.message
                    )
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                })
          /* setPersons(persons.concat(nameObject)) */
        }
  }

    const handleNewPersonChange = (event) => {
      event.preventDefault()
      console.log(event.target.value)
      setNewName(event.target.value)
    }

    const handlePhoneChange = (event) => {
      event.preventDefault()
    console.log(event.target.value)
      setNewPhone(event.target.value)
    }

    const handleFilterChange = (event) => {
      event.preventDefault()
    setFilter(event.target.value)
    }

    const handleDelete = (event) => {
        console.log(event.target.value())
        delName(event.target.value)
    }


  return (
      <div>
        <h1>Phonebook</h1>
          <Notification message={errorMessage} />
        <Filter filter={filter} handler={handleFilterChange} />
        <h2>add a new person</h2>
        <AddName newName={newName} phone={phone} handleNewPersonChange={handleNewPersonChange} handlePhoneChange={handlePhoneChange} addName={addName}/>
        <h2>Numbers</h2>
        <Numbers persons={persons} filter={filter} del={(id,name) => delName(id,name)} />
      </div>
  )

}

export default App