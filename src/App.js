import {useState, useEffect} from "react"
import {Blog} from "./components/Blog"
import {Notification} from "./components/Notification"
import blogService from "./services/blogs"
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [message, setMessage] = useState(null)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [user, setUser] = useState(null)
	const [newBlog, setNewBlog] = useState({title: "", author: "", url: ""})

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(blogs)
		)
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
		}
	}, [])

	const loginForm = () => (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type="text"
						value={username}
						name="Username"
						onChange={({target}) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type="password"
						value={password}
						name="Password"
						onChange={({target}) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)

	const handleLogin = async event => {
		event.preventDefault()
		try {
			const user = await loginService.login({username, password,})
			window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
			blogService.setToken(user.token)
			setUser(user)
			setUsername("")
			setPassword("")
		} catch (exception) {
			changeMessage({message: "Wrong credentials", type: "error"})
		}
	}

	const logout = () => {
		setUser(null)
		window.localStorage.removeItem("loggedBlogappUser")
	}

	const changeMessage = (message) => {
		setMessage(message)
		setTimeout(() => {
			setMessage(null)
		}, 5000)
	}

	const blogForm = () => (
		<div>
			<form onSubmit={addBlog}>
				<div>
					title:
					<input
						type="text"
						value={newBlog.title}
						name="Title"
						onChange={({target}) => setNewBlog({...newBlog, title: target.value})}
					/>
				</div>
				<div>
					author:
					<input
						type="text"
						value={newBlog.author}
						name="Author"
						onChange={({target}) => setNewBlog({...newBlog, author: target.value})}
					/>
				</div>
				<div>
					url:
					<input
						type="text"
						value={newBlog.url}
						name="URL"
						onChange={({target}) => setNewBlog({...newBlog, url: target.value})}
					/>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	)

	const addBlog = async (event) => {
		event.preventDefault()
		const blog = {
			title: newBlog.title,
			author: newBlog.author,
			url: newBlog.url
		}

		try {
			const responseBlog = await blogService.create(blog)
			setBlogs(blogs.concat(responseBlog))
			changeMessage({message: `Created new blog "${responseBlog.title}"`, type: "notification"})
			setNewBlog({title: "", author: "", url: ""})
		} catch (exception) {
			const errorMessage = `Something went wrong: ${exception.response.data.error}`
			changeMessage({message: errorMessage, type: "error"})
		}
	}

	return (
		<div>
			<Notification message={message}/>
			{!user && loginForm()}
			{user &&
				<div>
					<h2>Blogs</h2>
					<p>{user.name} logged in</p>
					<button onClick={logout}>logout</button>
					{blogForm()}
					{blogs.map(blog =>
						<Blog key={blog.id} blog={blog}/>
					)}
				</div>
			}
		</div>
	)
}

export default App