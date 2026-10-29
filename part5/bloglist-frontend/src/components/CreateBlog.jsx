const CreateBlog = ({ handleCreateBlog, newBlog, setNewBlog }) => {

  const handleInputChange = (e, key) => {
    setNewBlog({
      ...newBlog,
      [key]: e.target.value
    })
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>title <input type="text" id="title" value={newBlog.title} onChange={(e) => handleInputChange(e, 'title')} /></label>
        </div>
        <div>
          <label>author <input type="text" id="author" value={newBlog.author} onChange={(e) => handleInputChange(e, 'author')} /></label>
        </div>
        <div>
          <label>url <input type="text" id="title" value={newBlog.url} onChange={(e) => handleInputChange(e, 'url')} /></label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlog;