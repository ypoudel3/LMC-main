export default function Footer() {
  return (
    <div className="bg-black text-white">
      <div className="px-24">
      <div className="pt-3 pb-7 flex flex-row justify-between items-start ">
      
        {/* Support */}
        <div className="flex flex-col">
          <span className="font-semibold mb-2 ">Quick Access</span>
          <a href="">Send SOS</a>
          <a href="">Legal Help</a>
          <a href="">Track Expenses</a>
          <a href="">Report Abuse</a>
        </div>
{/* Logo & Description */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-3xl font-bold">L-MCM</div>
          <div className="pt-3">
            <i>Empowering Migrant Workers With Safety, Support and Security</i>
          </div>
          <div className="flex flex-row gap-2 pt-3">
            <i className="fa-brands fa-square-facebook rounded-xl border-white"></i>
            <i className="fa-brands fa-square-instagram"></i>
            <i className="fa-brands fa-square-x-twitter"></i>
            <i className="fa-brands fa-square-youtube"></i>
          </div>
        </div>
        
        {/* Contacts */}
        <div className="flex flex-col ">
          <span className="font-semibold mb-2">Contacts</span>
          <p>123 Example Road</p>
          <p>Kathmandu, Nepal</p>
          <p>support@lmcm.org</p>
          <p>+977 9863249457</p>
        </div>

      </div>
      <div className=" border-t pb-2"> 
      </div>
      <div className="py-3 text-center text-sm text-gray-400">
       Copyright © {new Date().getFullYear()} L-MCM. All Rights Preserved.
      </div>
      </div>
    </div>
  );
}
