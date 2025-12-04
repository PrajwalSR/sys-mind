/**
 * Cloud Provider Icon Reference for draw.io diagrams
 * 
 * This provides the AI with icon shape IDs for generating system architecture diagrams
 * with AWS, GCP, and Azure service icons.
 */

export const CLOUD_ICONS = {
    aws: {
        compute: {
            ec2: 'shape=mxgraph.aws4.ec2;fillColor=#ED7100;gradientColor=none;',
            lambda: 'shape=mxgraph.aws4.lambda;fillColor=#ED7100;gradientColor=none;',
            ecs: 'shape=mxgraph.aws4.ecs;fillColor=#ED7100;gradientColor=none;',
            eks: 'shape=mxgraph.aws4.eks_cloud;fillColor=#ED7100;gradientColor=none;',
            fargate: 'shape=mxgraph.aws4.fargate;fillColor=#ED7100;gradientColor=none;',
        },
        storage: {
            s3: 'shape=mxgraph.aws4.s3;fillColor=#277116;gradientColor=none;',
            ebs: 'shape=mxgraph.aws4.ebs;fillColor=#277116;gradientColor=none;',
            efs: 'shape=mxgraph.aws4.efs;fillColor=#277116;gradientColor=none;',
            glacier: 'shape=mxgraph.aws4.glacier;fillColor=#277116;gradientColor=none;',
        },
        database: {
            rds: 'shape=mxgraph.aws4.rds;fillColor=#2E73B8;gradientColor=none;',
            dynamodb: 'shape=mxgraph.aws4.dynamodb;fillColor=#2E73B8;gradientColor=none;',
            elasticache: 'shape=mxgraph.aws4.elasticache;fillColor=#2E73B8;gradientColor=none;',
            redshift: 'shape=mxgraph.aws4.redshift;fillColor=#2E73B8;gradientColor=none;',
            aurora: 'shape=mxgraph.aws4.aurora;fillColor=#2E73B8;gradientColor=none;',
        },
        network: {
            elb: 'shape=mxgraph.aws4.elastic_load_balancing;fillColor=#8C4FFF;gradientColor=none;',
            vpc: 'shape=mxgraph.aws4.vpc;fillColor=#8C4FFF;gradientColor=none;',
            cloudfront: 'shape=mxgraph.aws4.cloudfront;fillColor=#8C4FFF;gradientColor=none;',
            route53: 'shape=mxgraph.aws4.route_53;fillColor=#8C4FFF;gradientColor=none;',
            api_gateway: 'shape=mxgraph.aws4.api_gateway;fillColor=#8C4FFF;gradientColor=none;',
        },
        messaging: {
            sqs: 'shape=mxgraph.aws4.sqs;fillColor=#D86613;gradientColor=none;',
            sns: 'shape=mxgraph.aws4.sns;fillColor=#D86613;gradientColor=none;',
            kinesis: 'shape=mxgraph.aws4.kinesis;fillColor=#D86613;gradientColor=none;',
        },
        security: {
            iam: 'shape=mxgraph.aws4.iam;fillColor=#DD344C;gradientColor=none;',
            cognito: 'shape=mxgraph.aws4.cognito;fillColor=#DD344C;gradientColor=none;',
            secrets_manager: 'shape=mxgraph.aws4.secrets_manager;fillColor=#DD344C;gradientColor=none;',
        },
        monitoring: {
            cloudwatch: 'shape=mxgraph.aws4.cloudwatch;fillColor=#B0084D;gradientColor=none;',
            xray: 'shape=mxgraph.aws4.x_ray;fillColor=#B0084D;gradientColor=none;',
        },
    },

    gcp: {
        compute: {
            compute_engine: 'shape=mxgraph.gcp2.compute_engine;fillColor=#4285F4;',
            app_engine: 'shape=mxgraph.gcp2.app_engine;fillColor=#4285F4;',
            cloud_functions: 'shape=mxgraph.gcp2.cloud_functions;fillColor=#4285F4;',
            kubernetes_engine: 'shape=mxgraph.gcp2.kubernetes_engine;fillColor=#4285F4;',
            cloud_run: 'shape=mxgraph.gcp2.cloud_run;fillColor=#4285F4;',
        },
        storage: {
            cloud_storage: 'shape=mxgraph.gcp2.cloud_storage;fillColor=#34A853;',
            persistent_disk: 'shape=mxgraph.gcp2.persistent_disk;fillColor=#34A853;',
            filestore: 'shape=mxgraph.gcp2.filestore;fillColor=#34A853;',
        },
        database: {
            cloud_sql: 'shape=mxgraph.gcp2.cloud_sql;fillColor=#4285F4;',
            cloud_spanner: 'shape=mxgraph.gcp2.cloud_spanner;fillColor=#4285F4;',
            firestore: 'shape=mxgraph.gcp2.firestore;fillColor=#4285F4;',
            bigtable: 'shape=mxgraph.gcp2.bigtable;fillColor=#4285F4;',
            memorystore: 'shape=mxgraph.gcp2.memorystore;fillColor=#4285F4;',
        },
        network: {
            cloud_load_balancing: 'shape=mxgraph.gcp2.cloud_load_balancing;fillColor=#4285F4;',
            cloud_cdn: 'shape=mxgraph.gcp2.cloud_cdn;fillColor=#4285F4;',
            cloud_dns: 'shape=mxgraph.gcp2.cloud_dns;fillColor=#4285F4;',
            vpc: 'shape=mxgraph.gcp2.virtual_private_cloud;fillColor=#4285F4;',
        },
        messaging: {
            pub_sub: 'shape=mxgraph.gcp2.pub_sub;fillColor=#4285F4;',
        },
        security: {
            iam: 'shape=mxgraph.gcp2.iam;fillColor=#FBBC04;',
            cloud_kms: 'shape=mxgraph.gcp2.cloud_kms;fillColor=#FBBC04;',
            secret_manager: 'shape=mxgraph.gcp2.secret_manager;fillColor=#FBBC04;',
        },
        monitoring: {
            cloud_monitoring: 'shape=mxgraph.gcp2.cloud_monitoring;fillColor=#4285F4;',
            cloud_logging: 'shape=mxgraph.gcp2.cloud_logging;fillColor=#4285F4;',
        },
    },

    azure: {
        compute: {
            virtual_machines: 'shape=mxgraph.azure.compute.virtual_machine;fillColor=#0078D4;',
            app_services: 'shape=mxgraph.azure.compute.web_app;fillColor=#0078D4;',
            functions: 'shape=mxgraph.azure.compute.function_app;fillColor=#0078D4;',
            aks: 'shape=mxgraph.azure.compute.kubernetes_services;fillColor=#0078D4;',
            container_instances: 'shape=mxgraph.azure.compute.container_instances;fillColor=#0078D4;',
        },
        storage: {
            blob_storage: 'shape=mxgraph.azure.storage.blob_storage;fillColor=#0078D4;',
            disk_storage: 'shape=mxgraph.azure.storage.disk;fillColor=#0078D4;',
            file_storage: 'shape=mxgraph.azure.storage.file_storage;fillColor=#0078D4;',
        },
        database: {
            sql_database: 'shape=mxgraph.azure.database.sql_database;fillColor=#0078D4;',
            cosmos_db: 'shape=mxgraph.azure.database.cosmos_db;fillColor=#0078D4;',
            redis_cache: 'shape=mxgraph.azure.database.redis_cache;fillColor=#0078D4;',
        },
        network: {
            load_balancer: 'shape=mxgraph.azure.networking.load_balancer;fillColor=#0078D4;',
            application_gateway: 'shape=mxgraph.azure.networking.application_gateway;fillColor=#0078D4;',
            cdn: 'shape=mxgraph.azure.networking.cdn;fillColor=#0078D4;',
            dns: 'shape=mxgraph.azure.networking.dns;fillColor=#0078D4;',
            virtual_network: 'shape=mxgraph.azure.networking.virtual_network;fillColor=#0078D4;',
        },
        messaging: {
            service_bus: 'shape=mxgraph.azure.messaging.service_bus;fillColor=#0078D4;',
            event_grid: 'shape=mxgraph.azure.messaging.event_grid;fillColor=#0078D4;',
            event_hubs: 'shape=mxgraph.azure.messaging.event_hubs;fillColor=#0078D4;',
        },
        security: {
            active_directory: 'shape=mxgraph.azure.identity.active_directory;fillColor=#0078D4;',
            key_vault: 'shape=mxgraph.azure.security.key_vault;fillColor=#0078D4;',
        },
        monitoring: {
            monitor: 'shape=mxgraph.azure.monitoring.monitor;fillColor=#0078D4;',
            application_insights: 'shape=mxgraph.azure.monitoring.application_insights;fillColor=#0078D4;',
        },
    },
} as const;

/**
 * Generate icon documentation for AI prompts
 */
export function getIconDocumentation(provider: 'aws' | 'gcp' | 'azure'): string {
    const icons = CLOUD_ICONS[provider];
    let doc = `**${provider.toUpperCase()} Service Icons:**\n\n`;

    for (const [category, services] of Object.entries(icons)) {
        doc += `**${category.charAt(0).toUpperCase() + category.slice(1)}:**\n`;
        for (const [service, style] of Object.entries(services)) {
            doc += `- ${service.replace(/_/g, ' ')}: \`${style}\`\n`;
        }
        doc += '\n';
    }

    return doc;
}

/**
 * Type guard for cloud provider
 */
export function isCloudProvider(value: string): value is 'aws' | 'gcp' | 'azure' {
    return ['aws', 'gcp', 'azure'].includes(value);
}
