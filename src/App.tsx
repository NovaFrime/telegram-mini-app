'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Gamepad2, Home, ShoppingBag, Settings } from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface UserData {
  id: number
  first_name: string
  username?: string
  is_premium?: boolean
  photo_url?: string
}

interface Prize {
  id: number
  name: string
}

const prizes: Prize[] = [
  { id: 1, name: '100 Coins' },
  { id: 2, name: '50 Gems' },
  { id: 3, name: 'Mystery Box' },
  { id: 4, name: 'Rare Item' },
  { id: 5, name: 'Extra Spin' },
  { id: 6, name: 'Discount Coupon' },
];

export default function Component() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [balance] = useState(50)
  const [spins, setSpins] = useState(0)
  const [drawnPrize, setDrawnPrize] = useState<Prize | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

  const handleDraw = () => {
    if (isSpinning) return; // Prevent drawing while spinning
    setIsSpinning(true);
    
    // Simulate the spinning effect
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setDrawnPrize(randomPrize);
      setSpins(s => s + 1);
      setIsSpinning(false);
    }, 2000); // Spin for 2 seconds
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <motion.div
          className="text-4xl font-bold text-emerald-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3 border-b border-emerald-900/30">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-emerald-950/50 rounded-full px-3 py-1">
            <Crown className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-emerald-400 font-medium">{balance}</span>
          </div>
          <div className="flex items-center bg-emerald-950/50 rounded-full px-3 py-1">
            <Gamepad2 className="h-4 w-4 text-emerald-400 mr-1" />
            <span className="text-emerald-400 font-medium">{spins}</span>
          </div>
        </div>
        <Avatar className="h-8 w-8 ring-2 ring-emerald-500">
          <AvatarImage src={userData.photo_url || `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${userData.username || userData.first_name}`} />
          <AvatarFallback>{userData.first_name[0]}</AvatarFallback>
        </Avatar>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
        
        {/* Spinning Animation */}
        <motion.div 
          className={`w-64 h-64 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-8 ${isSpinning ? 'animate-spin' : ''}`}
          animate={isSpinning ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <span className="text-emerald-400 text-lg">{isSpinning ? 'SPINNING...' : 'PULL A PRIZE'}</span>
        </motion.div>

        {/* Draw Button */}
        <Button 
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
          onClick={handleDraw}
          disabled={isSpinning} // Disable button while spinning
        >
          {isSpinning ? 'SPINNING...' : 'PULL'}
        </Button>

        {/* Display Drawn Prize */}
        {drawnPrize && (
          <motion.div 
            className="mt-4 text-emerald-400 text-xl font-bold"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            You won: {drawnPrize.name}!
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center p-3 bg-black/90 border-t border-emerald-900/30">
        <Button variant="ghost" size="icon" className="text-emerald-400">
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-emerald-400">
          <Gamepad2 className="h-6 w-6" />
        </Button>
        <div className="relative -mt-8">
          <Button 
            className="h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black"
          >
            <Gamepad2 className="h-8 w-8" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="text-emerald-400">
          <ShoppingBag className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-emerald-400">
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
