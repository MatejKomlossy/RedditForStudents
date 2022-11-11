
function Upload({
    onInput,
    }) {
    return (
        <div className="container">
            <div className="row">
                <form>
                    <h3>React File Upload</h3>
                    <div className="form-group">
                        <input onChange={(e)=>onInput(e)}
                               type="file" />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Upload;