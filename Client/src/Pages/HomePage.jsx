// import { Link } from "react-router-dom";

// import HomePageImage from "../Assets/Images/homePageMainImage.png";
// import HomeLayout from "../Layouts/HomeLayout";

// function HomePage() {
//     return (
//         <HomeLayout>
//             <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
//                 <div className="w-1/2 space-y-6">
//                     <h1 className="text-5xl font-semibold">
//                         Find out best
//                         <span className="text-yellow-500 font-bold">
//                             Online Courses
//                         </span>
//                     </h1>
//                     <p className="text-xl text-gray-200">
//                         We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
//                     </p>

//                     <div className="space-x-6">
//                         <Link to="/courses">
//                             <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
//                                 Explore courses
//                             </button>
//                         </Link>

//                         <Link to="/contact">
//                             <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
//                                 Contact Us
//                             </button>
//                         </Link>
//                     </div>
//                 </div>

//                 <div className="w-1/2 flex items-center justify-center">
//                     <img alt="homepage image" src={HomePageImage} />
//                 </div>

//             </div>
//         </HomeLayout>
//     );
// }

// export default HomePage;
import { Link } from "react-router-dom";

import HomePageImage from "../Assets/Images/homePageMainImage.png";
import HomeLayout from "../Layouts/HomeLayout";

function HomePage() {
    return (
        <HomeLayout>
            <div className="pt-10 text-white flex flex-col lg:flex-row items-center justify-center gap-10 mx-5 lg:mx-16 h-auto lg:h-[90vh]">
                {/* Text Section */}
                <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
                        Find out the best
                        <span className="text-yellow-500 font-bold"> Online Courses</span>
                    </h1>
                    <p className="text-md sm:text-lg lg:text-xl text-gray-200">
                        We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
                    </p>

                    <div className="space-y-3 sm:space-x-6 flex flex-col sm:flex-row justify-center lg:justify-start">
                        <Link to="/courses">
                            <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                                Explore courses
                            </button>
                        </Link>

                        <Link to="/contact">
                            <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Image Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0">
                    <img className="w-full max-w-sm lg:max-w-full" alt="homepage" src={HomePageImage} />
                </div>
            </div>
        </HomeLayout>
    );
}

export default HomePage;
