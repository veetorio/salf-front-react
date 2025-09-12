import Select, {} from "react-select";
function Search(props) {
    const customStyles = {
        control: (base) => ({
            ...base,
            width: '350px', // 👈 define a largura do Select
        }),
    };
    return <div className="flex flex-col gap-2">
        <label className="c-gray-7 font-600">{props.label}</label>
        <Select isSearchable options={props.option} styles={customStyles}/>
    </div>;
}
export default Search;
