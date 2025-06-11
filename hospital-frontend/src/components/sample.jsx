// // import {React, useState} from 'react';
// import './sample.css';
// // import axios from 'axios';

// const Sample = () => {
//     return (
//         <>
//           <ul className='navbar'>
//             <li className='navbar-item' id='home'>
//                 <p>Home</p>
//             </li>
//             <li className='navbar-item' id='login'>
//                 <p>Login</p>
//             </li>
//             <li className='navbar-item' id='about'>
//                 <p>About Us</p>
//             </li>
//             <li className='navbar-item' id='contact'>
//                 <p>Contact Us</p>
//             </li>
//           </ul>
//           <div className='container'>
//             <h3 className='title'>STUDENT INQUIRY FORM A.Y. 2025 - 2026</h3>
//             <section className='form'>
//                 <span>Franchisee Name  </span>
//                 <select className='select-name' required> 
//                     <option>--SELECT--</option>
//                     <option>M. G. Road</option>
//                     <option>L. B. Shashtri Road</option>
//                     <option>Dhamdod Road</option>
//                 </select>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Academic Year  </span>    
//                 <input type="text" placeholder='2025 April - 2026 March' disabled/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Student First Name  </span>
//                 <input type="text" required/>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Middle Name  </span>
//                 <input type="text" required/>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Surname  </span>
//                 <input type="text" required/>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Date Of Birth  </span>
//                 <input type="date" required/>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Gender  </span>
//                 <select className='select-name'>
//                     <option>--SELECT--</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                 </select>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Standard  </span>
//                 <select className='select-name' required>
//                     <option>--SELECT--</option>
//                     <option>Toddler</option>
//                     <option>Nursery</option>
//                     <option>Junior K.G.</option>
//                     <option>Senior K.G.</option>
//                 </select>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Father's First Name  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Middle Name  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Surname  </span>
//                 <input type="text" required/>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Mother's First Name  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Middle Name  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Surname  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Address 1  </span>
//                 <input type="text"/>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Address 2  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Address 3  </span>
//                 <input type="text" required/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Contact No  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Mobile No  </span>
//                 <input type="text" required/>
//                 <span className='start-icon'>*</span>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Name Of The Last School Attended  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Medium  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Board  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Last Result: Percentagae  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>Rank/Grade  </span>
//                 <input type="text"/>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <span>How Did You Came To Know About Kinder Dream:  </span>
//                 <select className='select-name'>
//                     <option selected>From Friend</option>
//                     <option>From Friend</option>
//                     <option>From Relative</option>
//                     <option>From Newspaper</option>
//                     <option>From Event</option>
//                     <option>From Website</option>
//                     <option>From Advertisement</option>
//                     <option>E Book</option>
//                     <option>From Advertisement</option>
//                     <option>From Friend</option>
//                     <option>From Newspaper</option>
//                     <option>From Relative</option>
//                     <option>From Website</option>
//                     <option>Other if any(Specify)</option>
//                 </select>                
//                 <br/>
//                 <br/>
//                 <br/>
//                 <button type='submit'>Save</button>
//                 <button type='button' disabled='disabled'>Print</button>
//                 <button type='reset'>Cancel</button>
//             </section>
//           </div>
//         </>
//     );
// };

// export default Sample;