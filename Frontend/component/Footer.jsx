export default function Footer() {
  return (
    <div className="bg-black/80 text-white">
      <div className="pt-3 px-7 md:pl-20 pb-7 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Logo & Description */}
        <div>
          <div className="text-3xl font-bold">LMC</div>
          <div className="mt-2">
            Empowering Migrant Workers with <br />Safety, Support, and Security
          </div>
          <div className="flex flex-row gap-2 pt-6">
            <i className="fa-brands fa-square-facebook rounded-xl border-white"></i>
            <i className="fa-brands fa-square-instagram"></i>
            <i className="fa-brands fa-square-x-twitter"></i>
            <i className="fa-brands fa-square-youtube"></i>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col">
          <span className="font-semibold mb-2">Links</span>
          <a href="">Home</a>
          <a href="">How It Works</a>
          <a href="">Legal Help</a>
          <a href="">About Us</a>
        </div>

        {/* Support */}
        <div className="flex flex-col">
          <span className="font-semibold mb-2">Quick Access</span>
          <a href="">Send SOS</a>
          <a href="">Legal Help</a>
          <a href="">Track Expenses</a>
          <a href="">Report Abuse</a>
        </div>

        {/* Contacts */}
        <div className="flex flex-col">
          <span className="font-semibold mb-2">Contacts</span>
          <p>123 Example Road</p>
          <p>Kathmandu, Nepal</p>
          <p>support@lmcm.org</p>
          <p>+977 9863249457</p>
        </div>

      </div>
    </div>
  );
}
