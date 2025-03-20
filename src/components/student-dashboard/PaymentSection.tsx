
interface PaymentSectionProps {
  amount: string;
}

const PaymentSection = ({ amount }: PaymentSectionProps) => {
  return (
    <div className="glass-card dark:glass-card-dark rounded-xl p-6">
      <h3 className="font-medium mb-4">Payment Method</h3>
      
      <div className="space-y-4">
        <div className="flex items-center p-3 border border-primary/30 rounded-lg">
          <input type="radio" checked className="h-4 w-4 text-primary" readOnly />
          <div className="ml-3">
            <p className="font-medium">UPI Payment</p>
            <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
          </div>
        </div>
        
        <div className="p-6 border border-dashed border-primary/20 rounded-lg flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
              alt="QR Code"
              className="w-40 h-40 object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Scan this QR code to pay ₹{amount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
