import {BarLoader} from "react-spinners";

export const PageLoader = () => {
    return (
        <div className={"fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50 fade-in"}>
            <BarLoader/>
        </div>
    )
}