import { printDebug } from "../../utils/print_debug"

export const SustainingFormRow = ({id, calling, name, unit, onChange}: {id: number, calling: string, name: string, unit: string, onChange: (id: number, support: boolean) => void}) => {
  const inputName = `choice-${calling.replaceAll(" ", 
                    "-"
                  ).toLowerCase()}-${name.replaceAll(" ", 
                    "-"
                  ).toLowerCase()}`
  const idYes = `${inputName}-yes`
  const idNo = `${inputName}-no`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    printDebug(`Input ${e.target.name} changed to ${e.target.value}`);
    onChange(id, e.target.value === "true");
  }

  return (
    <div className="table-row-group">

      <div className="table-row text-sm opacity-50">
        {calling}
      </div>
      <div className="table-row -mt-2">
        <div className="table-cell">{name} ({unit})</div>
        <div className='table-cell'>
          <input type="radio" id={idYes} name={inputName} className="peer hidden" onChange={handleChange} value="true"/>
        <label
          htmlFor={idYes}
          className="flex h-6 w-6 ml-2 mr-4 cursor-pointer items-center justify-center
        rounded-full border border-gray-300 transition-colors
        
        hover:bg-gray-100
        peer-checked:border-stb-blue-20

        after:block after:h-3 after:w-3 after:rounded-full
        after:bg-stb-blue-20 after:transition-transform

        after:scale-0 peer-checked:after:scale-100"
        >
        </label>
      </div>
      <div className='table-cell'>
        <input type="radio" id={idNo} name={inputName} className="peer hidden" onChange={handleChange}  value="false" />
        <label
          htmlFor={idNo}
          className="flex h-6 w-6 cursor-pointer items-center justify-center
        rounded-full border border-gray-300 transition-colors
        
        hover:bg-gray-100
        peer-checked:border-stb-christmas-red

        after:block after:h-3 after:w-3 after:rounded-full
        after:bg-stb-christmas-red after:transition-transform

        after:scale-0 peer-checked:after:scale-100"
        >
        </label>
      </div>
    </div>
  </div>
  );
}