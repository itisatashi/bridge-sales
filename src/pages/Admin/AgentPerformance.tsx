import React, { useEffect, useState } from 'react';
import { UserRole, type Order } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/common/Card';
import { useOrdersStore } from '@/store/orders.store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock agents data - in a real app, this would come from an API
const mockAgents = [
  {
    id: '1',
    name: 'John Doe', 
    email: 'john.doe@example.com',
    role: UserRole.AGENT,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: UserRole.AGENT,
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: UserRole.AGENT,
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: UserRole.AGENT,
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: UserRole.AGENT,
  },
];

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

// Define types for our performance data
interface AgentPerformanceData {
  id: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface OrderChartData {
  name: string;
  orders: number;
}

interface RevenueChartData {
  name: string;
  revenue: number;
}

const AgentPerformance: React.FC = () => {
  const { orders } = useOrdersStore();
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformanceData[]>([]);
  const [totalOrdersByAgent, setTotalOrdersByAgent] = useState<OrderChartData[]>([]);
  const [revenueByAgent, setRevenueByAgent] = useState<RevenueChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate agent performance metrics
  useEffect(() => {
    const calculatePerformance = () => {
      setIsLoading(true);
      
      // In a real app, this data would come from the backend
      // For now, we'll simulate order assignment to agents
      const agentOrdersMap = new Map<string, Order[]>();
      
      // Assign orders to agents randomly for demo purposes
      orders.forEach(order => {
        const randomAgentIndex = Math.floor(Math.random() * mockAgents.length);
        const agentId = mockAgents[randomAgentIndex].id;
        
        if (!agentOrdersMap.has(agentId)) {
          agentOrdersMap.set(agentId, []);
        }
        
        agentOrdersMap.get(agentId)?.push(order);
      });
      
      // Calculate performance metrics for each agent
      const performanceData = mockAgents.map(agent => {
        const agentOrders = agentOrdersMap.get(agent.id) || [];
        const totalOrders = agentOrders.length;
        const totalRevenue = agentOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        return {
          id: agent.id,
          name: agent.name,
          totalOrders,
          totalRevenue,
          averageOrderValue,
        };
      });
      
      setAgentPerformance(performanceData);
      
      // Prepare data for charts
      setTotalOrdersByAgent(performanceData.map(agent => ({
        name: agent.name,
        orders: agent.totalOrders,
      })));
      
      setRevenueByAgent(performanceData.map(agent => ({
        name: agent.name,
        revenue: agent.totalRevenue,
      })));
      
      setIsLoading(false);
    };
    
    calculatePerformance();
  }, [orders]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Performance</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and analyze the performance of your sales agents
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading performance data...</p>
        </div>
      ) : (
        <>
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {agentPerformance.map((agent) => (
              <Card key={agent.id} className="p-4">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {agent.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{agent.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{agent.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(agent.totalRevenue)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Order Value</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(agent.averageOrderValue)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Orders by Agent Chart */}
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Orders by Agent</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={totalOrdersByAgent}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#0088FE" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Revenue by Agent Chart */}
            <Card className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue by Agent</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByAgent}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByAgent.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Detailed Performance Table */}
          <Card>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Average Order Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {agentPerformance.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                              {agent.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {agent.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {agent.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(agent.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(agent.averageOrderValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </AppLayout>
  );
};

export default AgentPerformance;
