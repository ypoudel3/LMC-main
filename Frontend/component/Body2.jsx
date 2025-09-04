
export default function Body2() {
  return (
    <>
    <div  className="pt-3 px-7 md:px-12 mb-5">
      <h1 className="font-bold text-3xl mt-7 text-center">Core Features</h1>
       <h1 className="text-gray-500 text-lg mt-1 pb-16  text-center">What You Can Do</h1>
     <div className=" grid  md:grid-cols-4 gap-3 pb-7">
      {/* first card*/}
      <div className="flex flex-col items-center">
        <div className=" rounded-full p-2 bg-gray-100 text-xl ">🔴</div>
        <div className="font-bold">Send SOS</div>
        <div className="text-center">Trigger instant emergency alerts with your one tap </div>
        

       </div>
        {/* second card*/}
       <div className="flex flex-col items-center">
        <div className=" rounded-full p-2 bg-gray-100  text-xl ">⚖️</div>
        <div className="font-bold">Legal Help</div>
        <div className="text-center">Talk to legal advisors in real-time through chat</div>
       </div>
       {/* third card */}
       <div className=" flex flex-col items-center">
        <div className=" rounded-full p-2 bg-gray-100 text-xl ">💸</div>
        <div className="font-bold">Track Expenses</div>
        <div className="text-center">Log your earnings, spending, and balance anytime</div>
       </div>
       {/*fourth card */}
       <div className="flex flex-col items-center">
        <div className="flex rounded-full p-2 bg-gray-100  text-xl ">🛡️</div>
        <div className="font-bold">Report Abuse</div>
        <div className="text-center">Flag unsafe employers or frauds anonymously</div>
       </div>
      </div>
     </div>
       <div className="bg-gray-100">
       <h1 className="font-bold text-3xl mt-7 pt-12 text-center">Problem Statement</h1>
       <h1 className="text-gray-500 text-lg mt-1 mb-8 text-center ">Why This Matters</h1>

       <div className="min-h-screen flex items-center justify-center p-5 ">
      <div className="relative w-[600px] h-[600px]">

        {/* Card 1 */}
        <div className="absolute top-0 left-0 w-[280px] h-[280px] rounded-[20px] p-[25px] text-white font-bold bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg ">
          <div className="text-[72px] font-light opacity-30 leading-none mb-2">01</div>
         
          <div className="text-[11px] uppercase opacity-90 mb-3">Exploitation by Employers</div>
          <div className="text-[11px] leading-tight opacity-80 font-normal">
            Unfair treatment including excessive work hours, underpayment below agreed wages,
            violation of contract terms and poor working conditions.
          </div>
          <div className="absolute bottom-[25px] right-[25px] w-[50px] h-[50px] bg-white/20 rounded-[10px] flex items-center justify-center">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="absolute top-0 right-0 w-[280px] h-[280px] rounded-[20px] p-[25px] text-white font-bold bg-gradient-to-br from-teal-400 to-teal-700 shadow-lg">
          <div className="text-[72px] font-light opacity-30 leading-none mb-2">02</div>
         
          <div className="text-[11px] uppercase opacity-90 mb-3">Withholding of Documents</div>
          <div className="text-[11px] leading-tight opacity-80 font-normal">
            Illegal retention of passports, work permits, identification documents or withholding of earned wages to control workers.
          </div>
          <div className="absolute bottom-[25px] right-[25px] w-[50px] h-[50px] bg-white/20 rounded-[10px] flex items-center justify-center">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] rounded-[20px] p-[25px] text-white font-bold bg-gradient-to-br from-pink-500 to-pink-800 shadow-lg">
          <div className="text-[72px] font-light opacity-30 leading-none mb-2">03</div>
          
          <div className="text-[11px] uppercase opacity-90 mb-3">Unsafe Conditions</div>
          <div className="text-[11px] leading-tight opacity-80 font-normal">
            Poor living quarters, dangerous work environments, inadequate safety equipment and substandard accommodation facilities.
          </div>
          <div className="absolute bottom-[25px] right-[25px] w-[50px] h-[50px] bg-white/20 rounded-[10px] flex items-center justify-center">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M7 14l3-3 3 3m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] rounded-[20px] p-[25px] text-white font-bold bg-gradient-to-br from-orange-600 to-red-500 shadow-lg">
          <div className="text-[72px] font-light opacity-30 leading-none mb-2">04</div>
        
          <div className="text-[11px] uppercase opacity-90 mb-3">No Emergency Access</div>
          <div className="text-[11px] leading-tight opacity-80 font-normal">
            Lack of access to emergency services, legal assistance, consular support or communication with family during crisis situations.
          </div>
          <div className="absolute bottom-[25px] right-[25px] w-[50px] h-[50px] bg-white/20 rounded-[10px] flex items-center justify-center">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full bg-white shadow-xl z-10 flex flex-col items-center justify-center">
          <div className="flex items-end gap-[3px] mb-[15px]">
            <div className="w-[8px] h-[20px] bg-yellow-400 rounded-t-[4px]"></div>
            <div className="w-[8px] h-[28px] bg-pink-500 rounded-t-[4px]"></div>
            <div className="w-[8px] h-[36px] bg-pink-700 rounded-t-[4px]"></div>
            <div className="w-[8px] h-[44px] bg-purple-900 rounded-t-[4px]"></div>
            <div className="w-[8px] h-[52px] bg-teal-400 rounded-t-[4px]"></div>
          </div>
          <div className="text-[18px] font-bold text-gray-800 mb-[2px]">PROBLEMS</div>
          
        </div>
      </div>
    </div>
    </div>
    
    </>
  )
}
