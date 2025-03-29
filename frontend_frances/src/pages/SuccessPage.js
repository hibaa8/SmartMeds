import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card"
import { CheckCircle } from "react-feather"

const SuccessPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Medication Added Successfully</CardTitle>
          <CardDescription>Your medication has been added to your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">You can now track this medication, set reminders, and monitor your usage.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/home">
            <Button>Return to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SuccessPage

