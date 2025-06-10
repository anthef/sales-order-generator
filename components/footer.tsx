'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    RiFacebookFill,
    RiInstagramFill,
    RiLinkedinFill,
    RiGithubFill,
} from 'react-icons/ri';

export function Footer() {
    return (
    <footer className="border-t bg-background">
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2">
                Sales Order Generator
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-6"
                >
                    <Link
                    href="https://github.com/anthef/sales-order-generator"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-primary"
                    >
                    <RiGithubFill className="inline-block mr-1 size-4" />
                    Repository
                    </Link>
                </motion.div>
            </div>

            <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 border-t pt-8 text-center"
            >
            <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Anthony. All rights reserved.
            </p>
        </motion.div>
        </div>
    </footer>
    );
}


