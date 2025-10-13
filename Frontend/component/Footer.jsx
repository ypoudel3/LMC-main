export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="px-6 md:px-24">
        
        {/* Top Section */}
        <div className="pt-6 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8 ">
          
          {/* Quick Access */}
          <div>
            <h3 className="font-semibold mb-3">Quick Access</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-gray-400">Send SOS</a></li>
              <li><a href="#" className="hover:text-gray-400">Legal Help</a></li>
              <li><a href="#" className="hover:text-gray-400">Track Expenses</a></li>
              <li><a href="#" className="hover:text-gray-400">Report Abuse</a></li>
            </ul>
          </div>

          {/* Logo & Description */}
          <div className="text-center">
            <div className="text-3xl font-bold">L-MCM</div>
            <p className="pt-3 italic">
              Empowering Migrant Workers With Safety, Support and Security
            </p>
            <div className="flex justify-center gap-4 pt-3 text-xl">
              <a href="#"><i className="fa-brands fa-square-facebook hover:text-gray-400"></i></a>
              <a href="#"><i className="fa-brands fa-square-instagram hover:text-gray-400"></i></a>
              <a href="#"><i className="fa-brands fa-square-x-twitter hover:text-gray-400"></i></a>
              <a href="#"><i className="fa-brands fa-square-youtube hover:text-gray-400"></i></a>
            </div>
          </div>

          {/* Contacts */}
          <div className="flex flex-col md:items-end justify-center  ">
            <h3 className="font-semibold mb-3 md:flex items-center">Contacts</h3>
            <p>123 Example Road</p>
            <p>Kathmandu, Nepal</p>
            <p>support@lmcm.org</p>
            <p>+977 9863249457</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Bottom Copyright */}
        <div className="py-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} L-MCM. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
